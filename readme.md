“智学未来”是一个旨在利用人工智能技术，特别是大型语言模型（LLM），来革新教育方式的开源项目。

## 🌟 主要功能

平台为三种不同角色（学生、教师、游客）提供了量身定制的功能。

### 👨‍🎓 学生端功能

* **智能成绩分析**：记录历次考试成绩，AI自动生成深度分析报告、学习建议和鼓励。
* **学习计划管理**：每日任务打卡，AI在一天结束后生成总结，并为次日提供规划建议。
* **心情日记本**：记录每日生活与学习感悟，AI每周生成总结，关注学生身心健康。
* **AI作文润色**：输入作文，AI提供专业的修改建议，提升写作水平。
* **文本翻译**：多语言互译工具。
* **师生论坛**：提出学习疑问，与其他同学或老师交流。

### 👩‍🏫 教师端功能

* **智能教案生成**：输入教学主题，AI快速生成包含教学目标、重难点、教学过程的完整教案。
* **AI作文批改**：智能批改学生作文，从内容、结构、表达多维度提供评分和评语。
* **教学任务管理**：管理每日教学任务，并通过AI总结回顾工作。
* **文本翻译**：辅助备课和阅读。
* **师生论坛**：解答学生提出的问题，促进教学互动。

### 游客功能

* 浏览平台功能介绍。
* 体验文本翻译功能。
* 查看师生论坛的公开内容。

## 🛠️ 技术栈

本项目采用前后端分离的现代化架构。

* **后端**: `Python` `Django` `Django REST framework`
* **前端**: `React` `Carbon Design System` `pnpm`
* **数据库**: `MySQL 8.0`
* **AI 核心**: `科大讯飞星火认知大模型 API`
* **部署**: `Docker` `Nginx` `阿里云服务器`

## 🏗️ 系统架构

平台功能按角色和模块进行划分，具有高内聚、低耦合的特点，便于维护和扩展。

## 🚀 快速开始 (部署指南)

### 1. 环境要求

* **操作系统**: `Ubuntu 22.04.4 LTS`
* **API 密钥**: 拥有一个可以正常调用**科大讯飞星火大模型**的 `APPID`, `APISecret`, `APIKey`。
* **Docker 环境**: 已安装 `Docker` 和 `Docker Compose`。

### 2. 部署步骤

1. **安装 Docker**
   
   ```sh
   export DOWNLOAD_URL="https://mirrors.tuna.tsinghua.edu.cn/docker-ce"
   curl -fsSL https://get.docker.com/ | sudo -E sh
   ```

2. **安装 Node.js (通过 nvm)**
   
   ```sh
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   # 使nvm生效，可能需要重启终端或执行 source ~/.bashrc
   export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
   # 安装Node.js
   nvm install node
   ```

3. **安装 pnpm**
   
   ```sh
   curl -fsSL https://get.pnpm.io/install.sh | sh -
   ```

4. **克隆本项目**
   
   ```sh
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

5. **配置环境变量**
   项目需要配置科大讯飞的 API 密钥。请在`backend/settings.py` 中，找到并填入您的密钥信息。默认带有的密钥信息为免费版api。

6. **启动项目**
   定位到项目根目录下，运行一键启动脚本：
   
   ```sh
   sh start.sh
   ```
   
   脚本将自动完成构建 Docker 镜像、安装依赖和启动服务等操作。

7. **访问平台**
   部署成功后，通过浏览器访问：
   
   * **平台前台**: `http://localhost:8001`
   * **管理员后台**: `http://localhost:8001/admin`
     * **默认账号**: `drkuma`
     * **默认密码**: `123qweasdzxc`
       
       > **安全提示：首次登录后，请务必修改默认的管理员密码！**

## 📚 项目文档

本项目在docs目录下拥有完整的开发文档，以帮助您更深入地了解其设计与实现细节。

## 📄 开源许可

本项目基于 [MIT License](LICENSE) 开源。

---

**如果这个项目对您有帮助，请给一个 ⭐️ Star！您的支持是我们不断前进的动力！**