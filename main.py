# !pip install roboflow
# !git clone https://github.com/ultralytics/yolov5  # clone
# %cd yolov5
# %pip install -qr requirements.txt comet_ml  # install

import torch
import utils
import os
display = utils.notebook_init()  # checks


from roboflow import Roboflow
rf = Roboflow(api_key="Didy7Z1c8YUW5o2Rpsaz")
# project = rf.workspace("aicook").project("aicook-self-annotated")
# dataset = project.version(4).download("yolov5")
project = rf.workspace("james-elcock").project("fridge-detection-ojugs")
dataset = project.version(6).download("yolov5")

# python train.py --img 416 --batch-size -1 --epochs 100 --data C:\Users\james\yolov5\Fridge-Detection-5\data.yaml --weights yolov5s.pt --cache
# python val.py --weights C:\Users\james\yolov5\runs\train\exp25\weights\best.pt --data C:\Users\james\yolov5\Fridge-Detection-5\data.yaml --img 640
# python detect.py --weights C:\Users\james\yolov5\runs\train\exp25\weights\best.pt --data C:\Users\james\yolov5\Fridge-Detection-5\data.yaml --conf 0.7  --source C:\Users\james\Downloads\test.jpg

