# Formation Flight Own Solution

date: 2024년 8월 2일
slug: Formation_flight
author: jinwoo im
status: Public
tags: Linear Control
summary: 인하대학교 김종한 교수님의 ASE6029 과제 Formation Flight에 대한 풀이를 작성해 보았다. 이를 적절하게 변형하면 ASE7030과제도 풀 수 있다. 
type: Post
thumbnail: Untitled_(1).png
updatedAt: 2024년 8월 3일 오후 1:13
category: 🚀 Automatic Control

## Formation Flight

---

드론의 포메이션 비행(Formation Flight)은 여러 대의 드론이 정해진 패턴이나 형상을 유지하며 동시에 비행하는 기술을 의미한다. 이 기술은 다양한 분야에서 응용되고 있으며, 특히 군사 작전, 엔터테인먼트, 재난 대응, 과학 연구 등에서 유용하게 사용되고 있다.

평면에서 드론 $k$의 동적 거동은 다음과 같이 설명할 수 있다.

$$
x^{(k)}_{t+1} = A x^{(k)}_t + B u^{(k)}_t
$$

여기서 상태 벡터  $x^{(k)}_t$ 는 2차원 위치 벡터 $p^{(k)}_t \in \text{R}^2$와 두 개의 속도 $v^{(k)}_t \in \text{R}^2$로 구성된다. 

드론의 제어 $u^{(k)}_t \in \text{R}^2$는 2차원 제어입력 벡터이다.

위의 동역학을 설명하는 행렬은 다음과 같다.

$$
A =
\begin{bmatrix}
1 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 \\
(1 - 0.5\gamma\Delta t)\Delta t & 0 & 1 - \gamma\Delta t & 0 \\
0 & (1 - 0.5\gamma\Delta t)\Delta t & 0 & 1 - \gamma\Delta t \\
\end{bmatrix}
$$

$$
B = 
\begin{bmatrix}
0.5 \Delta t^2 & 0 \\
0 & 0.5 \Delta t^2 \\
\Delta t & 0 \\
0 & \Delta t \\
\end{bmatrix}
$$

이때 $t \in \{0, \ldots, N-1\}$으로 가정하며, 여기서 $N = 1000$이고 $\Delta t = 0.02$이다. 또한 모든 차량은 동일한 상태천이 행렬 $A$와 $B$를 가지며 (동적으로) 동일하다고 가정한다.

```bash
import numpy as np
import matplotlib.pyplot as plt
import scipy.sparse as ssp
import scipy.sparse.linalg as sla

n = 1000 # number of timesteps
T = 20 # time will vary from 0 to T with step delt
ts = np.linspace(0,T,n+1)
delt = T/n
gamma = .05 # damping, 0 is no damping

A = np.zeros((4,4))
B = np.zeros((4,2))

A[0,0] = 1
A[1,1] = 1
A[0,2] = (1-gamma*delt/2)*delt
A[1,3] = (1-gamma*delt/2)*delt
A[2,2] = 1 - gamma*delt
A[3,3] = 1 - gamma*delt

B[0,0] = delt**2/2
B[1,1] = delt**2/2
B[2,0] = delt
B[3,1] = delt

```

드론들은 초기 상태에서 임의의 위치와 속도에 있다고 가정한다. 

이러한 랜덤 변수들은 정규 분포를 따르고 있다고 가정할 수 있다.

```bash
K = 50      # 50 drones

np.random.seed(1)

p_0 = np.random.randn(2,K)*5    # initial positions
v_0 = np.random.randn(2,K)      # initial velocities
```

```bash
print("Initial position:\n", p_0)
print("Initial velocity:\n", v_0)

plt.figure(figsize=(14,9), dpi=100)
for i in range(K):
  plt.plot(p_0[0,i], p_0[1,i], 'ro', markersize=5)
  plt.arrow(p_0[0,i], p_0[1,i], v_0[0,i], v_0[1,i], head_width=0.2, width=0.05, ec='none')
plt.title('Initial position and velocity')
plt.axis('equal')
plt.xlabel(r'$x$ position')
plt.ylabel(r'$y$ position')
plt.grid()
plt.show()
```

![Untitled](Formation%20Flight%20Own%20Solution%208cd7d6fab349449d9a988be9733f3c0d/Untitled.png)

최소 에너지 비행 경로를 찾아 다음과 같은 제약조건을 $t = N$에서 달성해야 한다.

추종 드론의 위치는 리더 드론에 상대적으로 정의된다. 

예를 들어, 리더 드론 주위에 균등한 간격으로 배치된 원형 Formation은 다음과 같이 생각할 수 있다.  

$$
p^{(k)}_N = p^{(1)}N + r{\text{formation}}
\begin{bmatrix}
\sin \frac{2\pi(k-1)}{K-1} \\
\cos \frac{2\pi(k-1)}{K-1} \\
\end{bmatrix}
$$

추종 드론(드론 $2, \ldots, K$)의 속도는 리더 드론의 속도와 같아야 한다. $v^{(k)}_N = v^{(1)}_N  \text{ for } k = 2, \ldots, K$

리더 드론(드론 1)은 사전 정의된 최종 속도를 가지고 있다. $v^{(1)}_N = v_f \in \text{R}^2$

리더 드론의 최종 위치 $p^{(1)}_N$는 제약이 없다.

다음 문제를 최소 노름 해법을 통해 최적의 포메이션 비행 경로를 찾아보시오.

$$
\begin{aligned}
\text{minimize } & \sum_{k=1}^K \sum_{t=0}^{N-1} \|u^{(k)}t\|^2 \\
\text{subject to } & x^{(k)}{t+1} = A x^{(k)}_t + B u^{(k)}_t, \quad \text{for } t = 0, \ldots, N-1 \text{ and } k = 1, \ldots, K, \\
& v^{(k)}_N = v^{(1)}_N, \quad \text{for } k = 2, \ldots, K, \\
& p^{(k)}_N = p^{(1)}N + r{\text{formation}}
\begin{bmatrix}
\sin \frac{2\pi(k-1)}{K-1} \\
\cos \frac{2\pi(k-1)}{K-1} \\
\end{bmatrix}, \quad \text{for } k = 2, \ldots, K.
\end{aligned}
$$

- 힌트
    
    모든 드론의 상태를 포함하는 4K-벡터를 상태 변수로 정의하면 된다.
    
    $$
    
    x_t =
    \begin{bmatrix}
    x^{(1)}_t \\
    \vdots \\
    x^{(K)}_t \\
    \end{bmatrix}
    
    $$
    
    모든 드론의 제어를 포함하는 2K-벡터를 제어 변수로 정의하면 된다. 
    
    $$
    u_t =
    \begin{bmatrix}
    u^{(1)}_t \\
    \vdots \\
    u^{(K)}_t \\
    \end{bmatrix}
    $$
    
    이 선형 동역학과 최적화 문제를 이들을 기준으로 표현하면 도움이 된다.
    
    기본 값:
    
    - $v_f = [5, 0]$ # 리더 드론의 목표 최종 속도
    - $r_{\text{formation}} = 5$   # 포메이션 원의 반지름

## 풀이

---

아래는 내 풀이이고, 정확한 풀이가 아닐 수 있다.

새로운 행렬 $A_c$ 와 $B_c$ 그리고 $A_{c_{1000}}$ 과 $B_{c_{1000}}$ 그리고 $C$ 와 $D$ 를 만들면 된다.

$$
A_c =
\begin{bmatrix}
A & 0 & \cdots & 0 \\
0 & A & \cdots & 0 \\
\vdots & \vdots & \ddots & \vdots \\
0 & 0 & \cdots & A \\
\end{bmatrix}

$$

$$
B_c =
\begin{bmatrix}
B & 0 & \cdots & 0 \\
0 & B & \cdots & 0 \\
\vdots & \vdots & \ddots & \vdots \\
0 & 0 & \cdots & B \\
\end{bmatrix}

$$

$$

C=
\begin{bmatrix}
I \\
\vdots\\
I \\
\end{bmatrix}

$$

$$
D = \begin{bmatrix}
r_{formation} sin(\frac{2\pi}{K-1})\\
r_{formation} cos(\frac{2\pi}{K-1})\\
0\\
0\\
r_{formation} sin(\frac{2*2\pi}{K-1})\\
r_{formation} cos(\frac{2*2\pi}{K-1})\\
0\\
0\\
r_{formation} sin(\frac{2*3\pi}{K-1})\\
r_{formation} cos(\frac{2*3\pi}{K-1})\\
0\\
0\\
\vdots
\end{bmatrix}
$$

이제 각각의 행렬에 대해서 설명하겠다.

행렬 $A_c$와 $B_c$는 t의 time step에 대해서 $x_t$에 대해 정의된 상태 천이 행렬과 제어 입력 행렬이다. 

따라서 아래와 같이 수식을 쓸 수 있다. 

$$
\begin{bmatrix}
x^{(1)}_{t+1} \\
\vdots \\
x^{(K)}_{t+1} \\
\end{bmatrix} = \begin{bmatrix}
A & 0 & \cdots & 0 \\
0 & A & \cdots & 0 \\
\vdots & \vdots & \ddots & \vdots \\
0 & 0 & \cdots & A \\
\end{bmatrix}
\begin{bmatrix}
x^{(1)}_{+1} \\
\vdots \\
x^{(K)}_{+1} \\ 
\end{bmatrix}
+ 
\begin{bmatrix}
B & 0 & \cdots & 0 \\
0 & B & \cdots & 0 \\
\vdots & \vdots & \ddots & \vdots \\
0 & 0 & \cdots & B \\
\end{bmatrix}\begin{bmatrix}
u^{(1)}_t \\
\vdots \\
u^{(K)}_t \\
\end{bmatrix}

$$

행렬 $C$와 $D$는 최종 제약 조건을 표현하는 행렬이다.

리더 드론에 대해 추종드론의 위치와 속도에 제약조건이 걸려있으므로 이를 하나의 선형 방정식으로 표현할 수 있다. 

$$
\begin{bmatrix}

x^{(1)}_{N} \\
\vdots \\
x^{(K)}_{N} \\
\end{bmatrix}  = 

\begin{bmatrix}
I \\
\vdots\\
I \\
\end{bmatrix}

\begin{bmatrix}
p^{(1)}_N\\
V^{(1)}_N\\
\end{bmatrix} + \begin{bmatrix}0\\
0\\
0\\
0\\
r_{formation} sin(\frac{2\pi}{K-1})\\
r_{formation} cos(\frac{2\pi}{K-1})\\
0\\
0\\
r_{formation} sin(\frac{2*2\pi}{K-1})\\
r_{formation} cos(\frac{2*2\pi}{K-1})\\
0\\
0\\
r_{formation} sin(\frac{2*3\pi}{K-1})\\
r_{formation} cos(\frac{2*3\pi}{K-1})\\
0\\
0\\
\vdots
\end{bmatrix}
$$

이때 조심해야 할 것은 $p^{(1)}_N$은 제약조건이 걸려있지 않다는 것이다.

그래서 $C$를 적절하게 쪼개야 한다. 

$C$의 Column Vector는 4개 존재하는데, 이중 첫번째와 두번째 Column Vector로 이루어진 행렬을 $C_1$이라 정의하고 세 번째와 네 번째 Column Vector로 이루어진 행렬을 $C_2$라 정의하자.

$$

C_1=
\begin{bmatrix}
1 &0 \\
0 &1 \\
0 &0 \\
0 &0 \\
\vdots &\vdots\\
1 &0 \\
0 &1 \\
0 &0 \\
0 &0 \\
\end{bmatrix}

$$

$$

C_2=
\begin{bmatrix}
0 &0 \\
0 &0 \\
1 &0 \\
0 &1 \\
\vdots &\vdots\\
0 &0 \\
0 &0 \\
1 &0 \\
0 &1 \\
\end{bmatrix}

$$

그러면 위의 선형방정식은 아래와 같은 형태로 다시 정의된다.

$$
\begin{bmatrix}

x^{(1)}_{N} \\
\vdots \\
x^{(K)}_{N} \\
\end{bmatrix}  = 

\begin{bmatrix}
1 &0 \\
0 &1 \\
0 &0 \\
0 &0 \\
\vdots &\vdots\\
1 &0 \\
0 &1 \\
0 &0 \\
0 &0 \\
\end{bmatrix}

\begin{bmatrix}
p^{(1)}_N\\ 
\end{bmatrix} 

+

\begin{bmatrix}
0 &0 \\
0 &0 \\
1 &0 \\
0 &1 \\
\vdots &\vdots\\
0 &0 \\
0 &0 \\
1 &0 \\
0 &1 \\
\end{bmatrix}
\begin{bmatrix}
v^{(1)}_N\\ 
\end{bmatrix} 

+ \begin{bmatrix}0\\
0\\
0\\
0\\
r_{formation} sin(\frac{2\pi}{K-1})\\
r_{formation} cos(\frac{2\pi}{K-1})\\
0\\
0\\
r_{formation} sin(\frac{2*2\pi}{K-1})\\
r_{formation} cos(\frac{2*2\pi}{K-1})\\
0\\
0\\
r_{formation} sin(\frac{2*3\pi}{K-1})\\
r_{formation} cos(\frac{2*3\pi}{K-1})\\
0\\
0\\
\vdots
\end{bmatrix}
$$

이는 아래와 같은 형태이다. 

$$
x_N = C_1 p^{(1)}_N + C2 v^{(1)}_N + D
$$

이는 affine function이라 생각할 수 있다.

그리고 초기입력 $x_0$ 에 대해 $x_N$은 아래와 같이 표현된다.

$$
x_N = 

A_c^{N} x_0
+
\begin{bmatrix}A_c^{N-1}B_c & A_c^{N-2}B_c & \cdots & A_cB_c & B_c \\ \end{bmatrix}

\begin{bmatrix}
u^{(1)}_0 \\
\vdots \\
u^{(K)}_0 \\
u^{(1)}_1 \\
\vdots \\
u^{(K)}_1 \\
\vdots \\
u^{(1)}_{N-1} \\
\vdots \\
u^{(K)}_{N-1}  \\
\end{bmatrix}

$$

$$
\begin{aligned}
\text{minimize } & \sum_{k=1}^K \sum_{t=0}^{N-1} \|u^{(k)}t\|^2 \\
\text{subject to } & x^{(k)}{t+1} = A x^{(k)}_t + B u^{(k)}_t, \quad \text{for } t = 0, \ldots, N-1 \text{ and } k = 1, \ldots, K, \\
& v^{(k)}_N = v^{(1)}_N, \quad \text{for } k = 2, \ldots, K, \\
& p^{(k)}_N = p^{(1)}N + r{\text{formation}}
\begin{bmatrix}
\sin \frac{2\pi(k-1)}{K-1} \\
\cos \frac{2\pi(k-1)}{K-1} \\
\end{bmatrix}, \quad \text{for } k = 2, \ldots, K.
\end{aligned}
$$

이제 위와 같은 최적화 문제는 아래와 같이 정의할 수 있다. 

$$

\begin{aligned}
\text{minimize } & \quad \|U\|^2 \\
\text{subject to } & \quad x_N = A_c^N x_0 +
\begin{bmatrix}
A_c^{N-1}B_c  & \cdots & A_cB_c & B_c 
\end{bmatrix}
\begin{bmatrix}
U
\end{bmatrix}, \\
& \quad x_N = C_1 p^{(1)}_N + C_2 v^{(1)}_N + D
\end{aligned}
 
$$

이때  $C_1 p^{(1)}_N + C_2 v^{(1)}_N + D =
A_c^N x_0 +
\begin{bmatrix}
A_c^{N-1}B_c & A_c^{N-2}B_c & \cdots & A_cB_c & B_c
\end{bmatrix}
\begin{bmatrix}
U
\end{bmatrix}$

를 만족해야 한다.

편의를 위해 $\begin{bmatrix}
A_c^{N-1}B_c & A_c^{N-2}B_c & \cdots & A_cB_c & B_c
\end{bmatrix}$ 를 $B_{c_{1000}}$ 이라 정의하자. 

또한 $A_c^N$ 을 $A_{c_{1000}}$ 이라 정의하자.

그러면 $C_1 p^{(1)}_N + C_2 v^{(1)}_N + D = A_{c_{1000}} x_0 +  B_{c_{1000}} U$ 이다. 

이때 최적화 문제는 $U$의 Norm 을 최소화 하는 것이다.

**$C_1 p^{(1)}N + C_2 v^{(1)}N + D -A_{c_{1000}} x_0 =  B_{c_{1000}} U$ 이라 생각할 수 있다.**

즉 $U = B_{c_{1000}}^{\dagger} C_1 p^{(1)}N + C_2 v^{(1)}N + D -A_{c_{1000}} x_0$ 으로 표현될 수 있고 이를 최소화 할 수 있는 $p^{(1)}N$ 을 찾으면 된다. 

$p^{(1)}N = (B_{c_{1000}}^{\dagger} C_1)^{\dagger}(-C_2 v^{(1)}N -D + A_{c_{1000}} x_0)$ 으로 생각할 수 있다. 

이를 다시 사용하여 U를 구한 다음, 전체 드론에 대해 경로를 구하면 아래와 같이 나온다.

![Untitled](Formation%20Flight%20Own%20Solution%208cd7d6fab349449d9a988be9733f3c0d/Untitled%201.png)

## 소스코드

---

```python
##A_c를 계산

A_total = np.zeros([len(A)*K,len(A)*K])
for i in range(K):
  A_total[4*i:4*(i+1),4*i:4*(i+1)] = A

##B_c를 계산

B_total = np.zeros([len(B)*K,len(B[0])*K])
for i in range(K):
  B_total[4*i:4*(i+1),2*i:2*(i+1)] = B

##A_c1000를 계산
A_total_1000 = np.linalg.matrix_power(A_total,n)

##B_c1000를 계산
B_total_1000 = np.zeros([4*K,2*K*n])

for i in range(n):
  B_total_1000[:,2*K*i:2*K*(i+1)] = np.linalg.matrix_power(A_total,n-i)@B_total

##C 계산 
C = np.zeros([4*K,4])
for i in range(K):
  C[4*i:4*(i+1),:] = np.eye(4)
##C1과 C2 쪼개기
C1 = C[:,0:2]
C2 = C[:,2:]

##D 계산
D = np.zeros(4*K)
for i in range(1,K):
  D[4*i] = r_formation  * np.sin(2*np.pi*(i) /(K-1))
  D[4*i+1] = r_formation  * np.cos(2*np.pi*(i) /(K-1))

x0 = np.zeros(K*4)
for i in range(K):
  x0[4*i:4*i+2] = p_0[:,i]
  x0[4*i+2:4*(i+1)] = v_0[:,i]

A_new = np.linalg.pinv(B_total_1000)@C1

B_new = np.linalg.pinv(B_total_1000)@(C2@v_f + D - A_total_1000@x0)

p_fin = np.linalg.pinv(A_new)@(-B_new)

X_1000 = C1 @ p_fin + C2 @ v_f + D

U   = np.linalg.lstsq(B_total_1000,X_1000 - np.linalg.matrix_power(A_total,n)@x0, rcond=0)[0]

## 시각화
plt.figure(figsize=(14, 9),dpi = 100)
for k in range(K):
  x_drone0 = np.hstack([p_0[:,k],v_0[:,k]])
  drone_x = np.zeros(n)
  drone_y = np.zeros(1000)
  drone_v_x = np.zeros(1000)
  drone_v_y = np.zeros(1000)
  for i in range(1000):
    u=U[100*i+2*k:100*i+2*(k+1)]
    x_drone0 = A@x_drone0 + B@u
    drone_x[i] = x_drone0[0]
    drone_y[i] = x_drone0[1]
    drone_v_x[i] = x_drone0[2]
    drone_v_y[i] = x_drone0[3]
  plt.plot(drone_x,drone_y)
  plt.plot(drone_x[0], drone_y[0], 'o', markersize=5, color = "red")
  plt.arrow(drone_x[0], drone_y[0], drone_v_x[0], drone_v_y[0], head_width=0.4, width=0.1, color = "blue", ec='none')
  plt.plot(drone_x[-1], drone_y[-1], '*', markersize=7, label='Target position',color = "blue")
plt.title("Optimal formation flight trajectories")
plt.xlabel("x position")
plt.ylabel("y position")
plt.grid(True)
plt.gca().set_aspect('equal', adjustable='box')

```

## 영상

[https://www.youtube.com/watch?v=oGCU4h7JjfY](https://www.youtube.com/watch?v=oGCU4h7JjfY)

## 후기

---

문제가 처음에 안 풀렸다. 

![최종 리더 위치는 구했는데 궤적값이 안나왔다](%EC%9D%B8%ED%95%98%EB%8C%80%ED%95%99%EA%B5%90%20%ED%95%AD%EA%B3%B5%EC%9A%B0%EC%A3%BC%EA%B3%B5%ED%95%99%EA%B3%BC%20%EC%84%A0%ED%98%95%EB%8C%80%EC%88%98%ED%95%99%202023%20%EA%B8%B0%EB%A7%90%EA%B3%A0%EC%82%AC%202%EB%B2%88%20%EB%AC%B8%EC%A0%9C%20%ED%92%80%EC%9D%B4%207f462aa32d6d46e8b7038babd1d96726/Untitled%205.png)

최종 리더 위치는 구했는데 궤적값이 안나왔다

최종 리더 위치가 적절하게 구해졌는데 이를 기반으로 U를 다시 구하는 과정에서 U가 이상하게 나왔다.

문제는 이 부분이었다.

```python

for i in range(n):
  B_total_1000[:,2*K*i:2*K*(i+1)] = np.linalg.matrix_power(A_total,i)@B_total

```

위 코드대로 하면

$$
\begin{bmatrix}
A_c^{N-1}B_c & A_c^{N-2}B_c & \cdots & A_cB_c & B_c
\end{bmatrix}
$$

이 아닌

$$
\begin{bmatrix}
B_c & A_cB_c & \cdots & A_c^{N-2}B_c & A_c^{N-1}B_c
\end{bmatrix}
$$

으로 계산된다. 

하지만 단순히 순서만 바뀐 블록 행렬이므로 최종 리더 위치는 구해졌지만 이를 다시 구축하는 과정에서 문제가 발생하였다.

근데 왜 최종 리더 위치는 올바르게 구해진 것일까?

아마 Permutation Matrix를 곱한 형태라 생각할 수 있는데 Permutation Matrix의 열벡터는 항상 Orthonormal하므로 최종 리더 위치는 적절하게 구해지는 것 같다. 

그래서 코드를 아래와 같이 변경했다.

```python

for i in range(1,n):
  B_total_1000[:,2*K*i:2*K*(i+1)] = np.linalg.matrix_power(A_total,n-i)@B_total
```

## 깃허브 링크

---

[https://github.com/AEInha/Linear-Algebra/blob/main/formation_flight.ipynb](https://github.com/AEInha/Linear-Algebra/blob/main/formation_flight.ipynb)

[https://github.com/AEInha/Linear-Algebra/blob/main/Formation_flight_2022.ipynb](https://github.com/AEInha/Linear-Algebra/blob/main/Formation_flight_2022.ipynb)