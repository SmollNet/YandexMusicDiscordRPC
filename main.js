const { Client } = require('discord.js-selfbot-v13');
require('dotenv').config();
const token = process.env.TOKEN;
const client = new Client({
    checkUpdate: false,
});
const net = require('net');
const Discord = require('discord.js-selfbot-v13');
try {
    client.on('ready', async () => {
        let old_title = "Yandex";
        let ImageGlobal;
        const server = net.createServer((socket) => {
            console.log('Client connected');
            // Обработчик события получения данных от клиента
            socket.on('data', async (data) => {
                function seconds2time (seconds) {
                    let date = new Date(seconds * 1000);
                    let hh = date.getUTCHours();
                    let mm = date.getUTCMinutes();
                    let ss = date.getSeconds();
                    // If you were building a timestamp instead of a duration, you would uncomment the following line to get 12-hour (not 24) time
                    // if (hh > 12) {hh = hh % 12;}
                    // These lines ensure you have two-digits
                    if (hh < 10) {hh = "0"+hh;}
                    if (mm < 10) {mm = "0"+mm;}
                    if (ss < 10) {ss = "0"+ss;}
                    // This formats your string to HH:MM:SS
                    let t = mm+":"+ss;
                    return t;
                }
                const text = data.toString('utf8');
                if (text.includes('ClearRPC')) {
                    client.user.setActivity(null);
                } else {
                    let music = text.split('|');
                    //console.log(music);
                    const track = JSON.parse(music[1]);
                    const tprogress = JSON.parse(music[0]);
                    let title = "Неизвестный";
                    if (track.title) {
                        title = track.title;
                    }
                    let cover = "yamusiclogo";
                    let app_icon = "https://cdn.discordapp.com/attachments/1074944894214361088/1093575731965083790/icon.png";
                    if (track.cover) {
                        cover = "https://" + track.cover.replace("%%", "200x200");
                    }
                    const artistTitles = track.artists.map(artist => artist.title);
                    const artistTitlesString = artistTitles.join(',');
                    const r = new Discord.RichPresence()
                    await Discord.RichPresence.getExternal(client, '848835233767751680', cover, app_icon).then((ImageGlobal) => {
                        r.setApplicationId('817229550684471297')
                            .setType('LISTENING')
                            .setName('Yandex Музыку')
                            .setState(title)
                            .setDetails(artistTitlesString)
                            .addButton('Слушать', 'https://music.yandex.ru' + track.link)
                            .setAssetsLargeImage(ImageGlobal[0].external_asset_path)
                            .setAssetsSmallImage(ImageGlobal[1].external_asset_path)
                            .setAssetsSmallText("YADM");
                        client.user.setActivity(r);
                    }).catch(error => {
                        console.error(error); // Вывод ошибки в консоль, если метод не выполнится успешно
                    });
                }
            });
            // Обработчик события отключения клиента
            socket.on('end', () => {
                client.user.setActivity(null);
                console.log('Client disconnected');
                // Закрытие сервера
                server.close(() => {
                    client.user.setActivity(null);
                    process.exit(0);
                });
            });
        });
        // Сервер прослушивает порт 8080 на всех доступных сетевых интерфейсах
        server.listen(8800, '0.0.0.0', () => {
            console.log('Server started');
        });
    });
    client.login(process.argv[2])
        .catch(console.error);
} catch (err) {
    console.error('Ошибка:', err.message);
}
