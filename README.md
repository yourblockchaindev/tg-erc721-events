# R3vealBot

This bot listens and interprets events on the blockchain sending messages into telegram chats.

### Roadmap
- [ ] Listen to ERC721 Transfer events
- [ ] Interpret base event
- [ ] Send base message to telegram chat

### Process

1. Add `R3vealBot` to your chat
2. Type `/start` in your chat
3. Register your chat_id and contract address on [https://r3veal.nft/register](https://r3veal.nft/register)
4. Start buying and selling your NFT collection!

### Messaging

#### /start

Hi! I am R3vealBot, I am ready to showcase your NFT on telegram and on [r3veal.nft](https://r3veal.nft)!

To get started, you will need to register your chat and contract at: [https://r3veal.nft/register](https://r3veal.nft/register). For that, you will need the chat_id: `chat_id`.

*Available commands*

- `/start` - shows this message.
- `/chat_id` - shows the chat id, required to register on the website.
- `/check` - checks the status of the contracts registered to this chat.

Official Group: @R3vealBotChat

#### /chat_id

This chat_id is `chat_id`. Head over to [https://r3veal.nft/register](https://r3veal.nft/register) to register your contract.

#### /check

The following contracts are registered to this chat:

*Name*
*Contract*: `address`
*Blockchain*: `chain`
*Expiry*: {x} days