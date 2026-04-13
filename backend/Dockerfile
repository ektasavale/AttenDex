FROM python:3.10

# Install system dependencies for dlib & OpenCV
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy project
COPY . .

# Install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Run Django app
CMD ["gunicorn", "attendex.wsgi:application", "--bind", "0.0.0.0:8000"]