# ASE2010 Applied linear algebra: Homework #1

updatedAt: 2024년 8월 7일 오후 8:58

## 1) Linear functions

---

### a) Show that an inner product function, $f(x) = a^T x$, is linear.

- answer
    
    linear함을 보이려면 **superposition**을 만족해야 한다. 즉 $f(\alpha a + \beta b) = \alpha f(a) + \beta f(b)$ 를 보이면 된다. 이때 $f(\alpha a + \beta b) = a^T(\alpha a + \beta b) = \alpha a^T + \beta b^T = \alpha f(a) + \beta f(b)$ 는 내적의 성질에 의해 자명히 만족된다. 물론 Homogeneity 와 Additivity 를 만족하는 것을 보임으로써 증명해도 되지만, 중첩의 원리(Superposition)이 만족되면 위 2가지가 자동으로 만족되므로, 중첩의 원리를 이용함으로써 해결했다. 
    

### b) Show that any scalar-valued linear function f(x) satisfying superposition can be expressed as an inner product function, say $f(x) = a^T x$. Explicitly state the elements of a in terms of $f$.

- answer
    
    $f(x) = a^T x$ 를 만족하는 vector a가 $f(x)$가 선형이면 자명하게 존재함을 보이자.
    
    내적의 정의를 생각한다면 아래와 같이 생각할 수 있다.
    
    $$
    \begin{bmatrix}
    a_1 &a_2 &\dots &a_n
    \end{bmatrix}
    \begin{bmatrix}
    b_1 \\
    b_2 \\
    \vdots \\
    b_n
    \end{bmatrix}
    =
    a_1 b_1 + a_2 b_2 + \cdots + a_n b_n
    $$
    
    이때 위와 같은 선형함수는 $f(x) = f(a_1 x_1 + a_2 x_2 + a_3 + x_3 + \dots + a_n x_n)$ 이라 생각할 수 있다.  즉 아래와 같은 형태로 표현된다.
    
    $$
    x = \begin{bmatrix}
    x_1 \\
    x_2 \\
    \vdots \\
    x_n
    \end{bmatrix} =
    
    x_1 
    \begin{bmatrix}
    1 \\
    0 \\
    \vdots \\
    0
    \end{bmatrix} +
    
    x_2 
    \begin{bmatrix}
    0 \\
    1 \\
    \vdots \\
    0
    \end{bmatrix} 
    
    + \dots + 
    
    x_n 
    \begin{bmatrix}
    0 \\
    0 \\
    \vdots \\
    1
    \end{bmatrix} 
    $$
    
    $$
    
    f(x) = f(a_1 x_1 + a_2 x_2 + a_3 + x_3 + \dots + a_n x_n) =\\ x_1f(a_1) + x_2f(a_2) + \dots+x_nf(x_n) = \\
    
    \begin{bmatrix}
    x_1 &x_2 &\dots &x_n
    \end{bmatrix}
    \begin{bmatrix}
    f(a_1) \\
    f(a_2) \\
    \vdots \\
    f(a_n)
    \end{bmatrix}
    = x^T a = a^T x
    $$
    

## 2) Affine functions

---

## 3) Parallelogram

---

Parallelogram. Draw two different vectors u and v out from the origin. Complete two
more sides to make a parallelogram with diagonals $w = u + v$ and $z = u − v$. Show
that $∥w∥^2 + ∥z∥^2 = 2∥u∥^2 + 2∥v∥^2$
.

- answer
    
    $||a||^2 =  a^T a$ 은 2 Norm의 정의에 의해 자명하다. 
    
    이때 **벡터의 내적은 교환법칙이 성립**한다. 이를 사용하면 된다. 
    
    $||w||^2 = w^T w = ( u + v)^T (u + v)$, $||z||^2 = z^T z = (u-v)^T(u-v)$ 이다. 
    
    이 2개를 더하면
    
    $$
    ( u + v)^T (u + v) +  (u-v)^T(u-v) = \\ 
    
    u^Tu + 2u^T v + v^Tv +  u^Tu -2u^T v + v^Tv = \\
    
    2u^Tu+ 2v^Tv = \\
    
    2||u||^2 + 2||v||^2 
    $$
    

## 4) Motion of a mass in response to applied force

---

저작권때문에 문제를 실을 수 없어서, VMLS 책의 2.3 문제를 보면 된다. 

- answer
    
    $$
    {s(t)}'' = F(t)\\
    s'(10) = s'(0) + \int_0^{10} F(\tau)d\tau = \\
    
     s'(0) + \int_0^{1} F(\tau)d\tau + \int_1^{2} F(\tau)d\tau +\dots + 
    \int_9^{10} F(\tau)d\tau = 
    \\
    
     s'(0) + f_1 + f_2 + f_3 +\dots + f_{10} = \\
    
    \begin{bmatrix}
    1 & 1 &\dots &1
    \end{bmatrix}
    \begin{bmatrix}
    f_1 \\
    f_2 \\
    \vdots \\
    f_{10}
    \end{bmatrix} + s'(0)
    
    $$
    
    이때 $s(t) = s(0) +  \int_0^{10} {s}'(\tau)d\tau$ 이므로 적분을 진행하면 
    
    $$
    s(t) =  s(0) + \int_0^{1} s'(\tau)d\tau  + \int_1^{2} s'(\tau)d\tau  + \int_9^{10} +\dots +s'(\tau)d\tau  \\ 
    
    \begin{bmatrix}
    \frac{19}{2} & \frac{17}{2}&\dots &\frac{1}{2}
    \end{bmatrix}
    \begin{bmatrix}
    f_1 \\
    f_2 \\
    \vdots \\
    f_{10}
    \end{bmatrix} +10 s'(0) + s(0)
    
    $$
    

### 5.  Price change to maximize profit

---

저작권때문에 문제를 실을 수 없어서, VMLS 책의 2.3 문제를 보면 된다. 

- answer
    
    dddd
    
    d
    
    d
    
    d
    
    d
    
    d
    

## 6. Nearest point to a line.

---

저작권때문에 문제를 실을 수 없어서, VMLS 책의 3.12 문제를 보면 된다. 

- answer
    
    이 문제는 최적화 문제이다. 
    
    최적화 문제는 특정 목적 함수(objective function)를 최소화하거나 최대화하려는 문제로, 주어진 제약 조건(constraints) 하에서 최적의 해(optimal solution)를 찾는 것을 목표로 한다.  
    
    즉 이 문제의 목적함수는 $||p-x||^2$ 이라 할 수 있고, 제약 조건은 $p = (1- \theta)a + \theta b$ 이다.  
    
    $$
    \begin{aligned}
    & \underset{p}{\text{minimize}}
    & & ||p - x||^2 \\
    & \text{subject to}
    & & p = (1 - \theta)a + \theta b
    \end{aligned}
    $$
    
    이때 주의해야 할 것은 $\theta$ 는 스칼라라는 점이다. 즉 다변수 미적분학이 아닌, 고등학교 수준의 미적분학을 사용하여 보일 수 있다.  
    
    $$
    \begin{aligned}
    & \underset{\theta}{\text{minimize}}
    & & || (1 - \theta)a + \theta b - x||^2 \\
    
    \end{aligned}
    $$
    
    이라 다시 정의할 수 있고 Norm의 정의에 의해서 
    
    $$
    \begin{aligned}
    & \underset{\theta}{\text{minimize}}
    & &
    ((1 - \theta)a + \theta b - x)^T ((1 - \theta)a + \theta b - x) \end{aligned}
    $$
    
    이는 아래와 같은 $\theta$ 에 대한 이차함수라 생각할 수 있다.
    
    $$
    J(\theta) = (b-a)^T (b-a) {\theta}^2 + 2(a-x)^T(b-a)\theta + (a-x)^T (a-x)   
    $$
    
    $$
    {J(\theta)}' = 2(b-a)^T(b-a)\theta + 2(a-x)^T(b-a)
    $$
    
    $$
    {{J}''(\theta)} =2(b-a)^T(b-a) \geq 0
    $$
    
    이때 이계도함수가 0보다 클 경우 볼록(Convex)하다고 한다. 목적함수가 볼록하다면, 목적함수의 미분값이 0이 되는 solution이 optimal solution이라는 것이 알려져 있다. 만약 0보다 작으면 오목하다고 하는데 이는 목적함수에 음수를 곱함으로써 간단하게 볼록하게 만들 수 있다. 
    
    즉 optimal solution $\theta_*$ 은 ${J}{(\theta_*)}' = 0$ 을 만족하는 $\theta_*$ 이다. 
    
    ${J(\theta_*)}' = 2(b-a)^T(b-a)\theta_* + 2(a-x)^T(b-a) = 0$ 이 되고
    
    이를 정리하면
    
    $(b-a)^T(b-a)\theta_* + (a-x)^T(b-a) = (\theta_* (b-a) + (a-x))^T (b-a) = 0$ 이 되고 
    
    이는 $(p-x)^T(b-a) =0$ 이 되므로 내적의 정의에 따라 두 벡터 $p-x$ 와 $b-a$는 서로 직교한다.