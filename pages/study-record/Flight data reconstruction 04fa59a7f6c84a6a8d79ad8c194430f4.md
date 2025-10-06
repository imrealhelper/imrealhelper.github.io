# Flight data reconstruction

date: 2024년 6월 5일
slug: ase2010_hw7
author: jinwoo im
status: Public
type: Post
updatedAt: 2025년 3월 16일 오후 6:49
category: 📗 LinearAlgebra

## **Flight data reconstruction**

We are given a scalar time series yt𝑦𝑡, t=1,…,n𝑡=1,…,𝑛, assumed to consist of an underlying slowly varying trend xt𝑥𝑡 and a more rapidly varying random component zt𝑧𝑡. Our goal is to estimate the trend component xt𝑥𝑡 or, equivalently, estimate the random component zt=yt−xt𝑧𝑡=𝑦𝑡−𝑥𝑡. This can be considered as an optimization problem with two competing objectives: We want xt𝑥𝑡 to be smooth, and we want zt𝑧𝑡 (our estimate of the random component, sometimes called the residual) to be small. In some contexts, estimating xt𝑥𝑡 is called *smoothing* or *filtering*.

For example, running the following cell returns a set of flight data recorded from a simulated flight of an aircraft. Specifically, `y` contains the angle of attack of the aircraft in degrees measured from a noisy sensor at timesteps given in `time`. Some of the data samples were lost and tha validity of the data is noted at the array `validity` (the value `False` implies that the data at the corresponding time is lost and should be considered invalid).

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("https://jonghank.github.io/ase2010/files/flight_data_corrupted.csv")
time = df['Time'].values
y = df['Total angle of attack'].values
validity = df['check'].values
df.head(20)
```

| **Time** | **Position_N** | **Position_E** | **Position_D** | **Flight path angle** | **Heading angle** | **Total angle of attack** | **Bank angle** | **Ground speed** | **Lateral acceleration (command)** | **...** | **Bank angle (response)** | **Drag force** | **Thrust force** | **Gravitational acceleration** | **Yaw** | **Pitch** | **Roll** | **Elevation** | **Azimuth** | **check** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **0** | 0.00 | 55.005011 | 0.536913 | -1868.460741 | -0.103162 | 1.908446 | 0.126335 | 0.151702 | 254.587928 | 2.638698 | ... | -0.163209 | 96549.499903 | 283359.959312 | 9.748550 | 1.983945 | -0.421522 | 0.443744 | 11.687808 | -1.799437 |
| **1** | 0.01 | -110.283126 | 1.059736 | -1818.905048 | -0.029843 | 2.040806 | -0.139267 | -0.203987 | 239.537515 | 2.541756 | ... | -0.081214 | 95040.555411 | 290421.942233 | 10.218011 | 1.982488 | -0.096032 | -0.440203 | 11.311827 | -2.073190 |
| **2** | 0.02 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | ... | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 |
| **3** | 0.03 | 94.628031 | 0.695827 | -1851.675473 | -0.274252 | 1.899385 | -0.068329 | -0.279113 | 253.203607 | 2.612910 | ... | -0.269807 | 94733.135157 | 283113.607669 | 10.121949 | 1.992223 | -0.428790 | 0.321779 | 10.764015 | -2.108597 |
| **4** | 0.04 | 85.989345 | 1.769041 | -1951.048143 | -0.016099 | 2.051501 | 0.496495 | -0.183974 | 256.279537 | 2.514960 | ... | 0.077175 | 90329.763471 | 274790.679222 | 9.973913 | 1.978867 | -0.922593 | -0.168985 | 10.805964 | -1.823342 |
| **5** | 0.05 | -8.450086 | 1.088868 | -1870.825518 | 0.134064 | 2.041622 | -0.196838 | -0.323338 | 253.051240 | 2.582319 | ... | -0.254543 | 96934.505218 | 280461.127737 | 9.462496 | 2.033034 | -0.134289 | -0.612730 | 12.014642 | -2.057017 |
| **6** | 0.06 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | ... | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 |
| **7** | 0.07 | 107.613307 | 2.170399 | -1826.672416 | -0.099284 | 2.065153 | 0.041041 | -0.520055 | 251.290935 | 2.452703 | ... | -0.417593 | 97709.037733 | 286726.379628 | 9.760878 | 2.028575 | 0.153582 | -0.772879 | 10.653007 | -1.983000 |
| **8** | 0.08 | 330.127794 | 0.282693 | -1864.025941 | -0.219342 | 2.031134 | 0.677237 | -0.867749 | 258.376881 | 2.453165 | ... | -0.689719 | 95349.665133 | 271627.851028 | 10.002768 | 1.963657 | 0.686379 | -1.191117 | 12.004601 | -2.142520 |
| **9** | 0.09 | 128.603779 | 1.040151 | -1887.483171 | -0.090208 | 2.006767 | 0.742770 | -0.829295 | 251.969889 | 2.556874 | ... | -1.133152 | 97265.317230 | 275089.775426 | 9.901765 | 1.998511 | 0.819135 | -0.816283 | 11.182176 | -2.108671 |
| **10** | 0.10 | -192.504434 | 0.046606 | -1883.606170 | -0.260529 | 1.969626 | 1.119053 | -0.599012 | 249.584059 | 2.519755 | ... | -0.564730 | 97203.858501 | 272123.042421 | 10.019837 | 1.977950 | 1.090654 | -0.772772 | 10.509945 | -2.029302 |
| **11** | 0.11 | -68.158083 | -0.268351 | -1889.264856 | -0.186067 | 2.050296 | 0.565659 | -1.545108 | 257.270443 | 2.516649 | ... | -1.474048 | 99612.157173 | 281017.141497 | 9.932044 | 1.941598 | 0.924564 | -1.075117 | 10.563910 | -2.152825 |
| **12** | 0.12 | -27.197225 | 2.935822 | -1881.116005 | -0.264641 | 2.067486 | 0.830552 | -0.891286 | 233.640821 | 2.570487 | ... | -1.051570 | 93391.651941 | 261509.831863 | 9.500741 | 1.999880 | 0.920356 | -1.002854 | 11.623950 | -1.995633 |
| **13** | 0.13 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | ... | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 |
| **14** | 0.14 | 89.519850 | 0.910562 | -1875.072822 | -0.352586 | 1.996769 | 1.682279 | -1.722104 | 250.290971 | 2.568209 | ... | -1.172835 | 95737.121471 | 275660.428351 | 9.796154 | 1.967858 | 1.691184 | -1.481927 | 12.021976 | -2.302072 |
| **15** | 0.15 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | ... | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 |
| **16** | 0.16 | 67.441316 | 1.712488 | -1905.778144 | -0.560962 | 1.922716 | 1.957159 | -1.924914 | 258.108385 | 2.483349 | ... | -1.709960 | 98729.873113 | 261412.510609 | 9.645564 | 1.951197 | 1.660956 | -1.772507 | 12.660814 | -2.403744 |
| **17** | 0.17 | 134.213893 | 0.045859 | -1907.827347 | -0.470698 | 2.031385 | 2.563911 | -1.349433 | 255.964573 | 2.566611 | ... | -1.562372 | 101519.700417 | 260337.017646 | 9.730292 | 2.019550 | 2.433988 | -1.545621 | 11.728387 | -2.452422 |
| **18** | 0.18 | 15.990027 | 0.820257 | -1950.739889 | -0.269782 | 1.993210 | 2.712255 | -1.523518 | 240.207534 | 2.514488 | ... | -1.750521 | 95397.086980 | 253339.135399 | 9.813469 | 1.891373 | 2.910484 | -1.874326 | 12.554875 | -2.379078 |
| **19** | 0.19 | 154.385143 | 1.118886 | -1920.465413 | -0.364952 | 2.017841 | 2.669474 | -2.022675 | 254.639600 | 2.521701 | ... | -1.868679 | 97890.246240 | 269639.952159 | 9.666615 | 1.872745 | 2.645791 | -2.232552 | 13.482146 | -2.292999 |

```python
plt.figure(figsize=(14,8),dpi=100)
plt.subplot(211)
plt.stairs(y, label='Corrupted')
plt.grid()
plt.legend()
plt.xlabel("Time steps")
plt.ylabel("Angle of attack (deg)")
plt.title("Angle of attack")
plt.subplot(212)
plt.stairs(y, label='Corrupted')
plt.grid()
plt.legend()
plt.xlim(100,500)
plt.xlabel("Time steps")
plt.ylabel("Angle of attack (deg)")
plt.show()
```

![Untitled](Flight%20data%20reconstruction%2004fa59a7f6c84a6a8d79ad8c194430f4/Untitled.png)

![Untitled](Flight%20data%20reconstruction%2004fa59a7f6c84a6a8d79ad8c194430f4/Untitled%201.png)

***(Problem 1)*** What are $V$ and $𝐷$? Explain how you can build V and D. Also explain how you can find the optimal solution x1,…,𝑥n, for the problem.

$V = 
\begin{pmatrix}
1 & 0 & 0 & \cdots & 0 \\
0 & 1 & 0 & \cdots & 0 \\
0 & 0 & 1 & \cdots & 0 \\
\vdots & \vdots & \vdots & \ddots & \vdots \\
0 & 0 & 0 & \cdots & 1 \\
\end{pmatrix}$

$D = 
\begin{pmatrix}
1 & -2 & 1 & 0 & 0 & \cdots & 0 \\
0 & 1 & -2 & 1 & 0 & \cdots & 0 \\
0 & 0 & 1 & -2 & 1 & \cdots & 0 \\
\vdots & \vdots & \vdots & \vdots & \vdots & \ddots & \vdots \\
0 & 0 & 0 & \cdots & 1 & -2 & 1 \\
\end{pmatrix}$

***(Problem 2)*** Compute the optimal solution $x_1,…,x_n$, for $λ=10^{-2},10^{0},10^{2},10^{4},10^6,10^8$, and explain what you observed from the results with different λ.

```python

def make_V(y):
  n = len(y)
  V = np.zeros((n,n))
  for i in range(n):
    if y[i] == float(0):
      V[i,i] = 0
    else:
      V[i,i] = 1
  return V

def make_D(y):
  n = len(y)
  D= np.zeros((n-2,n))
  for i in range(n-2):
    D[i][i] = 1
    D[i][i+1] = -2
    D[i][i+2] = 1
  return D
  
```

```python
V = make_V(y)
D = make_D(y)
X = {}
for i in range(-2,10,2):
  weight = 10**(i)
  A_new = np.vstack((V,np.sqrt(weight)*D))
  b_new = np.hstack((V@y,np.zeros(len(D))))
  X[i] = np.linalg.lstsq(A_new, b_new)[0]
```

```python
# your answer here
plt.figure(figsize=(14,8),dpi=100)
plt.subplot(211)
plt.stairs(y, label='Corrupted')
for i in range(-2,10,2):
  lambda_value = 10**i
  plt.stairs(X[i],label=f'Reconstructed (λ={lambda_value:.2e})')
  plt.grid()
  plt.legend()

plt.subplot(212)
plt.stairs(y, label='Corrupted')
for i in range(-2,10,2):
  lambda_value = 10**i
  plt.stairs(X[i], label=f'Reconstructed (λ={lambda_value:.2e})')
  plt.grid()
  plt.legend()

plt.xlim(300,400)
plt.ylim(0,5)
plt.xlabel("Time steps")
plt.ylabel("Angle of attack (deg)")
plt.show()
```

![Untitled](Flight%20data%20reconstruction%2004fa59a7f6c84a6a8d79ad8c194430f4/Untitled%202.png)

[Google Colab](https://colab.research.google.com/drive/1uMlN2taeiFp_k6CBujyqNSyVppuZRbg8?usp=sharing)