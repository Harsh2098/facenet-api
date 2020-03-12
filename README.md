# Facenet-API

Express API to Recognize Multiple Faces

# Setup

Install NodeJS dependencies and Tensorflow

```
npm install

pip3 install tensorflow
pip3 install scipy
pip3 install scikit-image
pip3 install -U scikit-learn scipy matplotlib
pip3 install opencv-python
apt-get install -y libsm6 libxext6 libxrender-dev
```

Install and Verify MongoDB

```
sudo apt install -y mongodb
sudo systemctl status mongodb
```

# Run Locally

```
npm start
```

# Docker

```
sudo docker build -t <tag> .
sudo docker run -p 3000:3000 <tag>

sudo docker-compose up --build -d
```
