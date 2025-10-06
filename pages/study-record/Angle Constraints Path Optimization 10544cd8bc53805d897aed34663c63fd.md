# Angle Constraints Path Optimization

updatedAt: 2024년 9월 18일 오후 3:51

# 각도 제약조건에서의 **Waypoint guidance**

---

A discrete-time linear dynamical system consists of a sequence of state vectors $$ x_t \in \mathbb{R}^n $$, indexed by time $$ t \in \{0,\dots,N-1\} $$, and dynamics equations:

$$
x_{t+1} = A x_t + B u_t
$$

where $$ u_t \in \mathbb{R}^m $$ is a control input to the dynamical system (e.g., a drive force or steering force on a vehicle). $$ A $$ is the state transition matrix, and $$ B $$ is the input matrix.

Given $$ A $$ and $$ B $$, the goal is to find the optimal controls $$ u_0, \dots, u_{N-1} $$ that drive the system's state to the desired final state $$ x_N = x_{\text{des}} $$ while minimizing the magnitude of $$ u_0, \dots, u_{N-1} $$.