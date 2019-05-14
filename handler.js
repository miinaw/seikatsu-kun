'use strict';
const https = require('https');
const _axios = require('axios');
const DynamoClient = require('./dynamo');
const line = require('@line/bot-sdk');
const crypto = require('crypto');
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

const client = new line.Client(config);
const axios = _axios.create({
  baseURL: 'https://api.line.me/v2/bot/',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`
  },
  responseType: 'json',
  httpsAgent: new https.Agent({
    ciphers: 'DES-CBC3-SHA'
    })
});

module.exports.hello = async (event, context) => {
  const signature = crypto.createHmac('sha256', process.env.CHANNEL_SECRET).update(event.body).digest('base64');
  const checkHeader = (event.headers || {})['X-Line-Signature'];
  const body = JSON.parse(event.body);
  if (signature === checkHeader) {
  createReply(body.events[0]);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };
  } else {
    console.error('認証エラー');
  } 
};

function createReply(event) {
  switch (event.message.text) {
    case 'お掃除当番': 
      cleaningDuty(event);
      break;

    case '買い物リスト':
      shoppingList(event);
      break;
    
    case '今日のご飯':
      dinnerList(event);
      break;
      
    default:
      confirmAddShoppingListItem(event);
      // console.log(isOk);
      // if (isOk) {
      //   addShoppingListItem(event);
      // }
      break;
  }
};

function cleaningDuty(event) {
  client.replyMessage(event.replyToken, {
    type: 'text',
    text: '月曜日：お風呂 \n水曜日：ゴミ出し \n土曜日：トイレ・洗面台 \n日曜日：ゴミ出し・台所'
  })
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.error(err);
  })
}

function shoppingList(event) {
  client.replyMessage(event.replyToken, {
    type: 'text',
    text: '歯磨き粉\n洗顔\n'
  })
}

function confirmAddShoppingListItem(event) {
  client.replyMessage(event.replyToken, {
    type: 'template',
    altText: '買い物リストに追加しますか？',
    template: {
      type: 'confirm',
      text: '買い物リストに追加しますか？',
      actions: [
        {
          type: 'message',
          label: 'Yes',
          text: 'Yes'
        },
        {
          type: 'message',
          label: 'No',
          text: 'No'
        }
      ]
    }
  })
}

function addShoppingListItem(event) {
  try {
    dynamoClient = new DynamoClient();
    params = {
      TableName: 'SeikatsuKunShoppingList',
      Item: {
        'name': event.message.text,
        'isCompleted': false, 
      }
    }
    result = dynamoClient.put(params);
    if (result) {
      client.replyMessage(event.replyToken, {
        type: 'text',
        text: `${event.message.text} を追加しました`
      }) 
    }
  }
  catch(err) {
    console.error(err);
  }
}

function dinnerList(event) {
  client.replyMessage(event.replyToken, {
    type: 'template',
    altText: '夕食リスト',
    template: {
      type: "carousel",
      columns: [
        {
          text: "カレー",
          thumbnailImageUrl: "https://img.cpcdn.com/recipes/539591/1200x630c/291984fd183aec4bad5d35bb4bf53038.jpg?u=514179&amp;p=1349958722",
          actions: [
            {
            type: "uri",
            label: "View Detail",
            uri: "https://cookpad.com/recipe/539591?psm_fnr=1"
            }
          ]
        },
        {
          text: "カレー",
          thumbnailImageUrl: "https://img.cpcdn.com/recipes/539591/1200x630c/291984fd183aec4bad5d35bb4bf53038.jpg?u=514179&amp;p=1349958722",
          actions: [
            {
            type: "uri",
            label: "View Detail",
            uri: "https://cookpad.com/recipe/539591?psm_fnr=1"
            }
          ]
        },
        {
          text: "カレー",
          thumbnailImageUrl: "https://img.cpcdn.com/recipes/539591/1200x630c/291984fd183aec4bad5d35bb4bf53038.jpg?u=514179&amp;p=1349958722",
          actions: [
            {
            type: "uri",
            label: "View Detail",
            uri: "https://cookpad.com/recipe/539591?psm_fnr=1"
            }
          ]
        },
      ]
    }
  })
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.error(err);
  })
}