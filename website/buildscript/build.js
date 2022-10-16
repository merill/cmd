/**
 * @name build.js
 * @description Creates Cloudflare _redirect file based on ./config/commands.csv
 */

const fs = require('fs');
const { parse } = require('csv-parse');
const os = require('os');

function getCommand(command, url){
    let cmd = {
        command: command,
        url: url
    }
    return cmd;
}

function expandAlias(commands){
    let allCommands = [];
    commands.forEach(cmd => {
        allCommands.push(getCommand(cmd.command, cmd.url));
        cmd.alias.forEach(alias => {
            if(alias.length > 0) {
                allCommands.push(getCommand(alias, cmd.url));
            }
        });
    });
    return allCommands;
}

function checkDuplicates(commands){
    console.log('Checking for duplicate commands.')
    let uniqueList = [];
    let duplicates = [];
    commands.forEach(cmd => {
        command = cmd.command;
        if(uniqueList.includes(command)){
            duplicates.push(command);
        }
        else{
            uniqueList.push(command);
        }
    });

    if(duplicates.length > 0){
        throw new Error('Duplicate commands/alias were found: ' + duplicates.toString());
    }
}
function createRedirectFile(commands){
    let redirectContent = '';
    commands.forEach(cmd => {
        redirectContent += '/' + cmd.command + ' ' + cmd.url + ' 302' + os.EOL;
    });
    
    console.log('Creating _redirects');
    fs.writeFileSync('./static/_redirects', redirectContent);
    console.log('Redirect file created successfully.')
}
async function run() {

    let commands = [];

    console.log('Parsing commands.csv');
    await fs.createReadStream('./config/commands.csv')
    .pipe(parse({ delimiter: ',', from_line: 2 }))
    .on('data', function (row) {
        let cmd = {
            command: row[0],
            alias: row[1].split('|'),
            description: row[2],
            category: row[3],
            url: row[4]
        }
        commands.push(cmd);
    })
    .on('end', function(){
        allCommands = expandAlias(commands);
        checkDuplicates(allCommands);
        createRedirectFile(allCommands);
    });
}

run();
