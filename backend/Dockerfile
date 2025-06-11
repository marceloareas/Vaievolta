# Usar a imagem oficial do Python como base
FROM python:3.9

WORKDIR /app

# Instale o netcat (para Alpine seria 'apk add', mas a imagem python:3.9 padrão é Debian/Ubuntu)
RUN apt-get update && apt-get install -y netcat-openbsd

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
