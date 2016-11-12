# Base Image (Python 2.x)
FROM python:2-onbuild
# Port number flask app shuold be running (5000 by default)
EXPOSE 5000
# Run app
CMD ["python", "beampressk/app.py"]
