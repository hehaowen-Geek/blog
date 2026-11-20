---
title: 如何更好地学习 Docker：从运行容器到部署自己的项目
description: 面向初学者的 Docker 学习路线，先理解镜像、容器和数据卷，再通过静态网页练习掌握 Dockerfile、端口映射、Compose 与常见故障排查。
date: 2026-11-04 00:00:00
updated: 2026-11-04 00:00:00
type: tech
categories: [技术]
tags: [Docker, 容器, Linux, 学习方法, 运维, 入门]
draft: false
permalink: /2026/docker
---

## 前言

学习 Docker 时，我们很容易碰到这样的情况：复制一条命令，网页能打开了，教程也跟着做完了；但换成自己的项目，就开始纠结端口怎么写、文件放在哪里、容器为什么一启动就退出。

想把 Docker 学扎实，每次练习都可以问自己：**程序在哪里运行？请求怎么到达它？数据保存在哪里？删掉容器后怎样恢复？**

这篇文章围绕一个简单的静态网页展开。先把它运行起来，再把操作写进文件，最后练习修改、重建和排错。示例用于本机学习，端口统一绑定到 `127.0.0.1`。

## 一、Docker 解决什么问题？

一个项目除了代码，往往还依赖语言运行时、系统库和配置。换台电脑后，版本差异、遗漏的依赖或不同的启动方式，都可能让程序无法运行。

Docker 让我们通过镜像描述并分发应用的运行环境，再用容器启动应用。团队成员可以根据同一份 Dockerfile 构建环境，根据同一份 Compose 配置启动服务，减少手工配置的差异。

它不能自动解决所有环境问题。处理器架构、外部服务、环境变量和持久化数据，仍然需要明确管理。

### 先区分几个概念

| 概念 | 可以怎样理解 | 本文中的例子 |
| --- | --- | --- |
| 镜像（Image） | 包含运行应用所需文件和默认配置的模板 | `nginx:stable-alpine` |
| 容器（Container） | 基于镜像创建的运行实例，有独立的可写层 | 名为 `docker-web` 的网页服务 |
| 镜像仓库（Registry） | 存储和分发镜像的服务 | Docker Hub |
| Dockerfile | 构建镜像的指令文件 | 把网页复制进 Nginx 镜像 |
| 数据卷（Volume） | 由 Docker 管理、独立于容器生命周期的数据存储 | 保存练习用的文本 |
| 绑定挂载（Bind mount） | 将宿主机的指定路径映射到容器路径 | 把本地网页目录挂进去 |
| Docker Compose | 用 YAML 描述并管理服务、网络和数据卷 | `compose.yaml` |

一个镜像可以创建多个容器。停止容器只是停止进程；删除容器会删除它的可写层，但镜像和命名卷有各自的生命周期。

### 容器和虚拟机有什么区别？

传统虚拟机通常运行自己的客户操作系统内核；Linux 容器则共享运行它们的 Linux 内核，通过进程、文件系统和网络等隔离机制组织应用。

Windows 或 macOS 上运行 Linux 容器时，Docker Desktop 会提供所需的 Linux 环境。所以“容器共享内核”不意味着 Linux 容器可以直接使用 Windows 内核。

初学时先掌握这些区别即可，后面再学习 namespace、cgroup 和镜像分层。

## 二、准备一个能正常使用的环境

Windows 用户可以按照 [Docker Desktop 官方安装说明](https://docs.docker.com/desktop/setup/install/windows-install/)准备环境，使用 WSL 2 后端，并确认 Docker Desktop 已启动、正在使用 Linux 容器。系统和 WSL 的具体要求以官方页面为准。

Linux 用户可以根据发行版查看 [Docker Engine 安装文档](https://docs.docker.com/engine/install/)。本文不混用不同发行版的安装命令，避免软件源和包名不匹配。

安装后，在终端依次检查：

```sh
docker version
docker info
docker compose version
docker run --rm hello-world
```

`docker version` 应能显示客户端和服务端信息。如果只有客户端正常，却提示无法连接 daemon，应先检查 Docker Desktop 或 Docker 服务是否启动，而不是反复安装命令行工具。

`hello-world` 会在需要时拉取镜像，运行后打印说明并退出。这里的退出是正常行为，因为它的任务已经完成。`--rm` 会在退出后自动删除这个练习容器。

如果卡在拉取镜像，先记录完整报错，再检查 DNS、网络、代理与仓库访问。不要为了绕过下载问题，直接执行来源不明的安装脚本。

## 三、第一次练习：把一个网页运行起来

下面的命令均写成单行，方便在 PowerShell 或常见 Linux Shell 中使用。

```sh
docker run -d --name docker-web -p 127.0.0.1:8080:80 nginx:stable-alpine
docker ps
```

浏览器打开 `http://localhost:8080`，应看到 Nginx 默认页面。

这条命令里：

- `-d` 让容器在后台运行。
- `--name docker-web` 给容器指定名称，后面查日志和停止它都更方便。
- `127.0.0.1:8080:80` 表示把宿主机回环地址上的 `8080` 端口转发到容器的 `80` 端口。
- `nginx:stable-alpine` 是镜像名称和标签，本机没有时会尝试拉取。

端口映射的顺序是 **宿主机地址:宿主机端口:容器端口**。修改左边的 `8080`，会改变浏览器使用的端口；右边的 `80` 必须匹配容器内服务实际监听的端口。

省略宿主机地址时，发布端口默认可能向所有网络接口开放。本机练习指定 `127.0.0.1` 更清楚，详见 [Docker 官方端口说明](https://docs.docker.com/get-started/docker-concepts/running-containers/publishing-ports/)。

接着观察并管理这个容器：

```sh
docker logs docker-web
docker exec docker-web nginx -t
docker stop docker-web
docker ps -a
docker start docker-web
```

`logs` 查看应用输出，`exec` 在正在运行的容器里执行命令，`ps -a` 还能看到已经停止的容器。先刷新几次网页，再看日志，就能把浏览器请求和服务端记录对应起来。

练习结束后，删除这个指定的容器，给下一步腾出端口：

```sh
docker stop docker-web
docker rm docker-web
```

不要用批量删除所有容器的命令代替练习清理，尤其是机器上还有其他项目时。

## 四、第二次练习：构建自己的网页镜像

新建一个独立练习目录 `docker-study`，在里面创建三个文件：

```text
docker-study/
├── index.html
├── Dockerfile
└── .dockerignore
```

`index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <title>我的 Docker 练习</title>
  </head>
  <body>
    <h1>我的第一个 Docker 网页</h1>
    <p>这段内容来自我构建的镜像。</p>
  </body>
</html>
```

`Dockerfile`，注意文件名没有 `.txt` 后缀：

```dockerfile
FROM nginx:stable-alpine
COPY index.html /usr/share/nginx/html/index.html
EXPOSE 80
```

`.dockerignore`：

```text
.git
.env
node_modules
*.log
```

进入这个目录，构建并启动：

```sh
docker build -t docker-study:v1 .
docker run -d --name docker-study-web -p 127.0.0.1:8080:80 docker-study:v1
```

最后的 `.` 表示当前目录是构建上下文。`COPY` 的源文件必须位于上下文中，且没有被 `.dockerignore` 排除。

打开 `http://localhost:8080`，确认出现自己写的文字。

### 理解构建和运行的边界

`FROM` 指定基础镜像，`COPY` 在构建时复制文件，`EXPOSE` 描述预期使用的端口。**`EXPOSE` 本身不会把端口发布到宿主机**，访问网页仍需要前面的 `-p`。

这个镜像沿用了 Nginx 基础镜像的启动配置，所以不需要另外写启动命令。自己打包其他应用时，再学习 `WORKDIR`、`RUN`、`CMD` 和 `ENTRYPOINT`，参考 [Dockerfile 官方入门](https://docs.docker.com/get-started/docker-concepts/building-images/writing-a-dockerfile/)。

修改本地 `index.html` 后，刷新页面通常不会变化，因为容器使用的是构建时复制进去的文件。可以把内容改为“第二版”，再执行：

```sh
docker build -t docker-study:v2 .
docker stop docker-study-web
docker rm docker-study-web
docker run -d --name docker-study-web -p 127.0.0.1:8080:80 docker-study:v2
```

这次刷新后应该看到新内容。由此理解：**构建镜像和替换容器是两个步骤，重启旧容器不会让它自动换成新镜像。**

`v1`、`v2` 是我们自己指定的标签，也可以被重新指向其他镜像；基础镜像的 `stable-alpine` 同样会更新。需要严格复现时，应进一步记录并固定镜像摘要 digest。

## 五、第三次练习：分清文件和数据存在哪里

### 用绑定挂载观察文件变化

在 `docker-study` 下新建 `site` 目录，放入一份 `index.html`。先停止并删除上一步的 `docker-study-web`，再从 `docker-study` 目录执行：

```sh
docker run -d --name docker-study-live -p 127.0.0.1:8080:80 --mount "type=bind,source=./site,target=/usr/share/nginx/html,readonly" nginx:stable-alpine
```

现在修改 `site/index.html`，刷新就能观察结果，不需要重新构建镜像。这里使用当前 Docker CLI 支持的相对绑定路径，执行前务必进入正确目录，并确保 `site` 已存在。

绑定挂载会遮住目标目录中原本的内容，不会把两边的目录自动合并。`readonly` 表示容器不能通过这个挂载修改宿主机文件，宿主机上的编辑仍然可见。

练习结束后停止并删除 `docker-study-live`。

### 用命名卷验证数据持久化

下面的命令使用全新的练习卷 `docker-study-data`，写入一段测试文字：

```sh
docker volume create docker-study-data
docker run --rm --mount type=volume,source=docker-study-data,target=/data alpine:3 sh -c 'echo docker-study > /data/note.txt'
docker run --rm --mount type=volume,source=docker-study-data,target=/data alpine:3 cat /data/note.txt
```

第一个临时容器已经被自动删除，第二个容器仍能读出 `docker-study`，说明数据在命名卷里。命名卷的具体宿主机位置由 Docker 管理；Docker Desktop 下它通常位于其 Linux 环境中，不要直接猜 Windows 路径去修改。

容器的可写层在容器被删除后消失，命名卷则会保留，直到被显式删除。需要在宿主机直接编辑的文件适合绑定挂载；应用产生、希望独立保留的数据可以使用命名卷，详见 [官方存储卷文档](https://docs.docker.com/engine/storage/volumes/)。

确认练习文本不再需要后，才删除这个测试卷：

```sh
docker volume rm docker-study-data
```

“数据保留下来了”和“有备份”是两回事。真正部署数据库时，还需要练习备份、恢复和迁移。

## 六、第四次练习：把运行方式写进 Compose

当启动参数越来越多时，可以用 `compose.yaml` 记录配置。仍然在 `docker-study` 目录，使用第四节的 Dockerfile 和根目录的 `index.html`：

```yaml
services:
  web:
    build: .
    ports:
      - "127.0.0.1:8080:80"
```

确认前面的练习容器已经停止，没有占用 `8080`，然后执行：

```sh
docker compose config
docker compose up -d --build
docker compose ps
docker compose logs --tail=50 web
```

`config` 可以帮助发现 YAML 和变量配置问题；`up -d --build` 构建并启动服务；`ps` 和 `logs` 用于检查状态。打开网页，确认内容与根目录的 `index.html` 一致。

修改网页后，再执行 `docker compose up -d --build`，让 Compose 根据构建结果更新服务。练习完执行：

```sh
docker compose down
```

普通 `down` 会移除该项目的容器与网络，不会默认删除命名卷。`down -v` 还会删除配置中的非 external 命名卷和所附匿名卷，使用前要确认里面没有需要保留的数据。

掌握单服务后，再跟着 [Docker 官方 Compose 入门](https://docs.docker.com/compose/gettingstarted/)练习应用与 Redis 的组合，重点观察服务名解析、健康检查和持久化配置。

同一 Compose 网络中的服务，通常通过**服务名和容器端口**通信，例如 `redis:6379`。容器里的 `localhost` 指它自己，不能用来代指另一个容器。普通的 `depends_on` 主要约束启动顺序，需要等待服务就绪时，还应配置健康检查及对应条件，应用自身也应能重试连接。

## 七、报错时按什么顺序排查？

先确定失败发生在哪一步：拉取镜像、构建、创建容器、启动进程，还是访问服务。不要把不同阶段的问题都归为“Docker 坏了”。

| 现象 | 优先检查 |
| --- | --- |
| 无法连接 Docker daemon | Docker Desktop 或服务是否启动，当前 context 是否正确 |
| 拉取镜像超时 | 镜像名、网络、DNS 和 Docker 自身的代理配置 |
| 名称已被使用 | 用 `docker ps -a` 查旧容器，确认归属后再删除或换名 |
| 端口已被占用 | 检查宿主机端口，或把映射中的 `8080` 换成 `8081` |
| 容器启动后立即退出 | 先看日志和退出状态，确认主进程是否正常结束或报错 |
| 容器运行但网页打不开 | 服务监听地址、端口映射、应用日志和防火墙 |
| 修改代码后没有变化 | 区分镜像里的文件与绑定挂载，确认是否重新构建并更新容器 |
| 挂载后目录变空 | 检查源路径，以及挂载是否遮住了镜像原有目录 |

以 Compose 项目为例，可以从以下命令开始：

```sh
docker compose ps -a
docker compose logs --tail=100 web
docker compose exec web nginx -t
```

`exec` 要求目标容器仍在运行。容器已退出时，先看日志；反复执行进入容器的命令不会让它恢复。

自己开发 HTTP 服务时，通常需要让应用在容器内监听 `0.0.0.0`，这样端口转发才能到达它。这个监听地址与宿主机端口绑定的 `127.0.0.1` 属于不同的网络环境，不矛盾。

## 八、怎样安排学习，才能真正用起来？

可以按四个阶段安排练习，不必拘泥于每天学多少条命令。

| 阶段 | 动手任务 | 学会的判断标准 |
| --- | --- | --- |
| 第一周：运行与观察 | 启停 Nginx，修改宿主机端口，查看日志 | 能解释镜像、容器、进程与端口的关系 |
| 第二周：构建与更新 | 写 Dockerfile，构建两个版本，替换容器 | 能独立完成“改代码→构建→更新→验证” |
| 第三周：存储与网络 | 练习挂载、命名卷，再连接两个服务 | 能说明数据在哪里、服务怎样互相访问 |
| 第四周：项目复现 | 为自己的小项目写 Compose 和 README | 换一个干净目录，按文档就能启动并恢复数据 |

每次练习留下一份简短记录：使用了哪些文件、执行了什么命令、预期结果是什么、失败时怎样定位。看到报错后，把原因和解决过程补进去，比单纯收集命令更有价值。

完成上面的练习后，可以继续学习多阶段构建、构建缓存、非 root 用户、镜像扫描、资源限制和备份恢复。暂时不用急着转向 Kubernetes，先确保自己能把一个小项目稳定地运行、更新和恢复。

如果结合 CTF 学习，可以用 Docker 复现有明确授权的本地题目环境，并练习限制端口和资源。容器仍然共享内核和宿主机资源，不是运行未知程序的绝对安全边界；尤其要理解 `--privileged`、宿主机目录挂载和 Docker socket 挂载带来的权限。

## 九、给自己留一道综合练习

从一个空目录开始，独立完成下面的任务：

1. 写一个介绍自己的静态网页，为它编写 Dockerfile。
2. 用 Compose 在本机 `8080` 端口启动，检查日志和页面。
3. 修改网页，完成重新构建与更新，并说明为什么只重启不够。
4. 把练习端口改成 `8081`，确认新地址可用。
5. 另做一个命名卷实验，证明删除容器后数据依然存在。
6. 写一份 README，说明启动、更新、验证、停止与数据清理的方法。

当你能解释每一步操作改变了什么，并能在失败时找到证据，就已经开始具备用 Docker 解决实际问题的能力了。

## 参考资料

- [Docker 官方入门](https://docs.docker.com/get-started/)：继续理解镜像、容器和应用运行流程。
- [Docker Desktop Windows 安装](https://docs.docker.com/desktop/setup/install/windows-install/)：核对系统、WSL 与安装要求。
- [Docker Engine 安装](https://docs.docker.com/engine/install/)：按 Linux 发行版选择安装方法。
- [Dockerfile 参考](https://docs.docker.com/reference/dockerfile/)：查阅构建指令的完整语义。
- [绑定挂载](https://docs.docker.com/engine/storage/bind-mounts/)与[数据卷](https://docs.docker.com/engine/storage/volumes/)：理解文件来源和生命周期。
- [Compose 入门](https://docs.docker.com/compose/gettingstarted/)：继续练习多服务应用。
