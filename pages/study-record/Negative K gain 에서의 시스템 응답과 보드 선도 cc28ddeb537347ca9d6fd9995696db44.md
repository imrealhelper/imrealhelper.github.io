# Negative K gain 에서의 시스템 응답과 보드 선도

date: 2024년 6월 8일
slug: ae-negative_K_gain
author: jinwoo im
status: Public
tags: 자동제어
type: Post
thumbnail: feedback.png
updatedAt: 2025년 2월 15일 오후 8:18
category: 자동제어

제어시스템의 특성방정식은 $1+KG(s) = 0$ 으로 정의된다.

오일러공식에 의해 $G(jw) = Ae^{j\theta}$로 나타낼 수 있다.

이때 $K>0$이면 $jw$는 $1+Ae^{j\theta} = 0$ 을 만족시켜야 하므로, $A=1, \theta = -\pi$를 만족시키는 $jw$로 정의된다.

따라서 $G(jw)$의 보드선도를 그려 $\theta = -\pi$ 를 만족시키는 $w$를 찾고 그때의 크기를 구한 다음 게인을 얼마나 키워야 크기가 1이 될지를 구하면 된다.

그렇다면 $K<0$이면 어떤 $w$를 찾아야 될까?

$1+KG(s) = 1-(K_2)(G(s))$를 만족한다고 해보자.

이때 $K_2 = -K > 0$이다.

그러면 오일러공식에 의해 $1-(K_2)(G(s)) =0$ 이 되어야 하므로 $G(s)$의 위상이 0도인 지점을 찾으면 된다. 

## 연습문제

---

**feedback control with negative K gain system.** 아래와 같은 시스템 G(s)를 상수 게인 K를 사용한 비례제어를 통해 안정화하려고 한다. 

이때 폐루프 시스템을 안정화할 수 있는 K의 범위를 구하시오. 

$$
G(s) = \frac{(s-5)}{(s)(s+5)(s^2 + 10s + 50)}
$$

 

![Untitled](Negative%20K%20gain%20%EC%97%90%EC%84%9C%EC%9D%98%20%EC%8B%9C%EC%8A%A4%ED%85%9C%20%EC%9D%91%EB%8B%B5%EA%B3%BC%20%EB%B3%B4%EB%93%9C%20%EC%84%A0%EB%8F%84%20cc28ddeb537347ca9d6fd9995696db44/Untitled.png)

### 해설

이 시스템은 적분기가 1개인 type1시스템이므로 시스템을 안정화시키는 K에 대해서는 steady state error 는 0이다. 

이 시스템의 근 궤적을 그려보면 아래와 같다

![Untitled](Negative%20K%20gain%20%EC%97%90%EC%84%9C%EC%9D%98%20%EC%8B%9C%EC%8A%A4%ED%85%9C%20%EC%9D%91%EB%8B%B5%EA%B3%BC%20%EB%B3%B4%EB%93%9C%20%EC%84%A0%EB%8F%84%20cc28ddeb537347ca9d6fd9995696db44/Untitled%201.png)

이 시스템은 양수 K값을 조금만 키워도 발산한다. 

하지만 $K$값이 음수라면 어느정도 큰 K에 대해서도 시스템은 발산하지 않고 안정화될 것이다. 

실제로 근궤적을 그려보면 아래와 같다. 

![Untitled](Negative%20K%20gain%20%EC%97%90%EC%84%9C%EC%9D%98%20%EC%8B%9C%EC%8A%A4%ED%85%9C%20%EC%9D%91%EB%8B%B5%EA%B3%BC%20%EB%B3%B4%EB%93%9C%20%EC%84%A0%EB%8F%84%20cc28ddeb537347ca9d6fd9995696db44/Untitled%202.png)

이때 -G(s)의 보드플롯을 그려 phase가 180을 만족하는 점을 찾자.

![Untitled](Negative%20K%20gain%20%EC%97%90%EC%84%9C%EC%9D%98%20%EC%8B%9C%EC%8A%A4%ED%85%9C%20%EC%9D%91%EB%8B%B5%EA%B3%BC%20%EB%B3%B4%EB%93%9C%20%EC%84%A0%EB%8F%84%20cc28ddeb537347ca9d6fd9995696db44/Untitled%203.png)

이때 게인마진은 42db이므로 |K|는 42db = 125까지 넣을 수 있고 이때 K는 음수이므로 -125까지 견딜 수 있다. 

또한 $K=-1$ 일때 스텝응답을 계산해보면 아래와 같이 나온다.

![Untitled](Negative%20K%20gain%20%EC%97%90%EC%84%9C%EC%9D%98%20%EC%8B%9C%EC%8A%A4%ED%85%9C%20%EC%9D%91%EB%8B%B5%EA%B3%BC%20%EB%B3%B4%EB%93%9C%20%EC%84%A0%EB%8F%84%20cc28ddeb537347ca9d6fd9995696db44/Untitled%204.png)

언더슛, 그리고 오버슛이 발생하지 않고 dc gain이 1로 안정하게 가는 모습을 볼 수 있다. 

하지만 이것보다 더 빠르게 풀 수 있는 방법이 있다.

바로 나이퀴스트 선도를 이용하는 것이다.

아래는 G(s)의 나이퀴스트 선도이다. 

![Untitled](Negative%20K%20gain%20%EC%97%90%EC%84%9C%EC%9D%98%20%EC%8B%9C%EC%8A%A4%ED%85%9C%20%EC%9D%91%EB%8B%B5%EA%B3%BC%20%EB%B3%B4%EB%93%9C%20%EC%84%A0%EB%8F%84%20cc28ddeb537347ca9d6fd9995696db44/Untitled%205.png)

이는 절대 안정화시킬 수 없음을 의미한다. 

어떤 k를 쓰더라도 무조건 -1을 기준으로 시계방향으로 한바퀴 돈다. 

하지만 -G(s)의 나이퀴스트 선도를 그려보면 아래와 같다.

![Untitled](Negative%20K%20gain%20%EC%97%90%EC%84%9C%EC%9D%98%20%EC%8B%9C%EC%8A%A4%ED%85%9C%20%EC%9D%91%EB%8B%B5%EA%B3%BC%20%EB%B3%B4%EB%93%9C%20%EC%84%A0%EB%8F%84%20cc28ddeb537347ca9d6fd9995696db44/Untitled%206.png)

이를 보면 음의 부호를 곱하는 것은 나이퀴스트 선도에서 180도 회전, 정확히는 허수축에 대해 대칭이동한 것이다. 

이를 보면 내가 생각하는 게인과 다르게 해야 작동되는 시스템이 있음을 알 수 있다. 

또한 위 시스템의 게인 마진은 42db로 굉장히 강건하다는 것을 알 수 있다.