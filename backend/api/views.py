from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import torch
import torch.nn.functional as F
from .models import transform, model, classes
from PIL import Image
import base64
import io

@api_view(['POST'])
def predict(request):
  decoded_bytes = base64.b64decode(request.data["image"])
  imagePIL = Image.open(io.BytesIO(decoded_bytes))
  imagePIL = imagePIL.resize((32,32), Image.ANTIALIAS)
  imageTensor = transform(imagePIL)
  output = model(imageTensor)
  softmax = F.softmax(output, dim=1)
  predicted_class = [classes[indx] for indx in torch.argmax(softmax, dim=1)]
  result = f"Looks like a {predicted_class[0]} in front."
  return Response(result, status=status.HTTP_200_OK)
