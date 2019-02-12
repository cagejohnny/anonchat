**Usage Rules**

To be able to use anonymous chat. You need to start personal message (PM) with anonchat bot. Commands work only in PM. Any PM messages other than commands will be sent to anonymous channel if you are joined already or ignored. Example, step by step:

```Markdown
1. [prefix]list

anonchannel1
anonchannel2

2. [prefix]join anonchannel1
3. test message
```
This is how is possible to join `anonchannel1` on server and send `test message`. All messages will be also translated back in PM from the channel.

**Administrators**

Before anyone will be able to join any channel it must be registered as anonymous by administrator or user with permissions to manage text channels. To do so, you need to run `-init` command in the channel that you want to register as anonymous.
