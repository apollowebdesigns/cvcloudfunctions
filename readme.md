# Cloud functions for CV

A back end profile for my online CV. I use firebase functions to perform serverside actions.

To run the command to deploy and update lambda functions

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

npm run-script build; firebase serve --only functions

firebase serve --only functions

```bash
firebase deploy
```