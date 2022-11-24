# Import the libraries
import os
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.vgg16 import VGG16, preprocess_input
from tensorflow.keras.models import Model
from pathlib import Path
import os
import numpy as np
from PIL import Image
from FeatureExtractor import FeatureExtractor
fe = FeatureExtractor()

# Iterate through images (Change the path based on your image location)
# print("Begin extraction")
#
# features = []
# for img_path in sorted(Path(img_root_path).glob("*.jpg")):
#
#     # Extract Features
#     feature = fe.extract(img=Image.open(img_path))
#     # Save the Numpy array (.npy) on designated paths
#     feature_path = "feature.npy"
#     feature_path = Path("./cat-feature") / (img_path.stem + ".npy")
#     np.save(feature_path, feature)
#     features.append(feature)
#
# print("Finish extraction")


# Import the libraries
import matplotlib.pyplot as plt


############ Start searching ####################
# read npy into features
img_paths = []
features = []
for feature_path in Path("./feature").glob("*.npy"):
    features.append(np.load(feature_path))
    img_paths.append(Path("../dataset") / (feature_path.stem + ".jpg"))
features = np.array(features)

# Insert the image query
img = Image.open("./query/3c67873e72e93a50fe273494ffc6af29.jpg")
# Extract its features
query = fe.extract(img)
# Calculate the similarity (distance) between images
dists = np.linalg.norm(features - query, axis=1)
# Extract 30 images that have lowest distance
ids = np.argsort(dists)[:30]
scores = []
for id in ids:
    if id < len(img_paths):
        scores.append((dists[id], img_paths[id]))
        print(scores)
#scores = [(dists[id], img_paths[id]) for id in ids]
# Visualize the result
axes=[]
fig=plt.figure(figsize=(8,8))
for a in range(5*6):
    score = scores[a]
    axes.append(fig.add_subplot(5, 8, a+1))
    subplot_title=str(score[0])
    axes[-1].set_title(subplot_title)
    plt.axis('off')
    plt.imshow(Image.open(score[1]))
fig.tight_layout()
plt.show()
