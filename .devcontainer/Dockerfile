# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.217.4/containers/typescript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version (use -bullseye variants on local arm64/Apple Silicon): 16, 14, 12, 16-bullseye, 14-bullseye, 12-bullseye, 16-buster, 14-buster, 12-buster
ARG VARIANT="16-bullseye"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${VARIANT}

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node packages
# RUN su node -c "npm install -g <your-package-list -here>"

# Install s2i
ARG S2I_VERSION=v1.3.1
RUN mkdir -p /tmp/s2i && \
    curl -s https://api.github.com/repos/openshift/source-to-image/releases/tags/${S2I_VERSION}| grep browser_download_url | grep linux-amd64 | cut -d '"' -f 4 | wget -qi - -P /tmp/s2i/ && \
    tar -xvf /tmp/s2i/source-to-image*.gz -C /tmp/s2i && \
    mv /tmp/s2i/s2i /usr/local/bin && mv /tmp/s2i/sti /usr/local/bin && \
    rm -rf /tmp/s2i

# Install ngrok
RUN curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && \
    echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | tee /etc/apt/sources.list.d/ngrok.list && \
    apt update && \
    apt install ngrok