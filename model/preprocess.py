import cv2
import os

def extract_frames(video_path, output_folder):
  video_capture = cv2.VideoCapture(video_path)
  fps = video_capture.get(cv2.CAP_PROP_FPS)
  total_frames = int(video_capture.get(cv2.CAP_PROP_FRAME_COUNT))

  print(f"Frames per second: {fps}")
  print(f"Total frames: {total_frames}")

  if not os.path.exists(output_folder):
    os.makedirs(output_folder)

  for frame_number in range(total_frames):
    ret, frame = video_capture.read()
    if not ret:
      break
    frame_filename = os.path.join(output_folder, f"frame_{frame_number:04d}.png")
    cv2.imwrite(frame_filename, frame)

  video_capture.release()
  print(f"Frames extracted and saved to {output_folder}")


def process_videos(input_folder, output_folder):
  for filename in os.listdir(input_folder):
    if filename.endswith(".mp4"):
      video_path = os.path.join(input_folder, filename)
      print(f"Processing video: {video_path}")
      extract_frames(video_path, output_folder+'/'+filename)


if __name__ == "__main__":
  input_folder = "./videos"
  output_folder = "./dataset"
  process_videos(input_folder, output_folder)
  