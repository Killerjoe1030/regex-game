FROM kasmweb/core-ubuntu-focal:1.17.0
USER root

ENV HOME /home/kasm-default-profile
ENV STARTUPDIR /dockerstartup
ENV INST_SCRIPTS $STARTUPDIR/install
WORKDIR $HOME

######### Customize Container Here ###########

RUN apt-get update \
    && apt-get install -y nodejs npm \

WORKDIR /home/kasm-user/Regex-Game

RUN npm ci

COPY . .



# RUN  wget -qO - https://download.sublimetext.com/sublimehq-pub.gpg | apt-key add - \
#     && apt-get update \
#     && apt-get install -y apt-transport-https \
#     && echo "deb https://download.sublimetext.com/ apt/stable/" |  tee /etc/apt/sources.list.d/sublime-text.list \
#     && apt-get update \
#     && apt-get install sublime-text \
#     && cp /usr/share/applications/sublime_text.desktop $HOME/Desktop/ \
#     && chmod +x $HOME/Desktop/sublime_text.desktop \
#     && chown 1000:1000 $HOME/Desktop/sublime_text.desktop

# RUN echo "/usr/bin/desktop_ready && /opt/sublime_text/sublime_text &" > $STARTUPDIR/custom_startup.sh \
# && chmod +x $STARTUPDIR/custom_startup.sh


######### End Customizations ###########

RUN chown 1000:0 $HOME
RUN $STARTUPDIR/set_user_permission.sh $HOME

ENV HOME /home/kasm-user
WORKDIR $HOME
RUN mkdir -p $HOME && chown -R 1000:0 $HOME

USER 1000