module.exports = {
  name: "credits",
  desc: "Show bot credits.",
  args: [],
  exec: ({packageJSON}, Message, Args) => {
    Message.channel.send(`Avicii.js version **${packageJSON.version}** | Made with :hearts: by Dario HALILOVIC <<@349118194197200896>> with the help of CallMePanda <<@191907565230096386>> | © Copyright 2018.`);
  }
}