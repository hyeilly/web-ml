### 1. tensorflow에서 학습

- DNN으로 digit 데이터 학습. keras D(16),D(10)으로 구성. adam사용.  
- CNN으로 digit 데이터 학습 . 데이터의 reshape이 필요함. (1797, 8, 8)으로 구성
- DNN으로 mnist 데이터 학습. keras D(128/relu),D(128/relu),D(10/softmax). 인식률 95%
- CNN으로 mnist 데이터 학습 . 데이터의 reshape이 필요함. (6000,28 , 28, 1)으로 구성
- Conv2D(32,(3,3)),MP, Conv2D(64,(3,3)),MP, F, D(10). 인식률 99%

### 2. 학습 후 model.save(“”)으로 내보내기
- /assets와 /variables 와 saved_model.pb가 저장된다.

### 3. 마법사를 이용해 콘솔창을 열어 tensorflowjs 를 설치한 아나콘다 환경으로 이동한다.
```
$ conda activate tfconverter-env
$ tensorflowjs_wizard
```
- 이후 “”폴더가 생기는데 여기에 group1-shard1of1.bin과 model.json 파일이 생성

### 4. index.html으로 불러와서 model.json 파일을 불러 쓸수 있도록.
