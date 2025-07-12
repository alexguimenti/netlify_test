const axios = require("axios");

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  const data = JSON.parse(event.body);

  if (data.starred_at) {
    const currentTime = new Date().toLocaleTimeString();

    console.log("🔔 Webhook recebido:", currentTime);

    const avatar = data.sender.avatar_url;
    const repository = data.repository.name;
    const user = data.sender.login;

    const payload = {
      content: ":wave: Hi mom! :wave:\n\n" +
               `**${user}** just starred **${repository}** at **${currentTime}**`,
      embeds: [
        {
          image: {
            url: avatar,
          },
        },
      ],
    };

    try {
      await axios.post(process.env.DISCORD_WEBHOOK_URL, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao enviar para o Discord:", error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Erro ao enviar para o Discord" }),
      };
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ status: "sucesso", mensagem: "Webhook recebido!" }),
  };
};
