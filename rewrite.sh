git filter-branch --force --env-filter '
if [ "$GIT_AUTHOR_NAME" = "Nael Alqtati" ]; then
    export GIT_AUTHOR_NAME="Devika Yanamala"
    export GIT_AUTHOR_EMAIL="devikayanamala611@gmail.com"
fi
if [ "$GIT_COMMITTER_NAME" = "Nael Alqtati" ]; then
    export GIT_COMMITTER_NAME="Devika Yanamala"
    export GIT_COMMITTER_EMAIL="devikayanamala611@gmail.com"
fi
' --tag-name-filter cat -- --branches --tags
