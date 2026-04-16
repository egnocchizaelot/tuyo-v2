'use strict'

angular.module('forumModule').
service('forumService', [
    function (){

        const orders = { STARS: 0, LIKES: 1, FRIENDS: 2, FIFO: 3};


        this.CreateMessageTree = function (messages) {
            return CreateMessageTree(messages);
        }

        this.FindActives = function (messageTree) {
            return FindActives(messageTree);
        }

        this.OrderMessageTree = function (messageTree, order) {

            switch (order) {
                case orders.STARS:
                    return OrderByStars(messageTree);
                break;

                case orders.LIKES:
                    return OrderByLikes(messageTree);
                break;

                case orders.FRIENDS:
                    return OrderByFriends(messageTree);
                break;

                case orders.FIFO:
                    return OrderByFIFO(messageTree)
                break;

            }
             return messageTree;
        }

        this.SendSelectedToTop = function (messageTree, id) {

            if (!messageTree)
                return messageTree;

                for (let i = 0; i < messageTree.length; i++) {
                    if (messageTree[i].sender.id === id) {
                        let message = messageTree.splice(i, 1);
                        messageTree.unshift(message[0]);
                        return messageTree;
                    }
                }

            return messageTree;
        }

        this.BackToTheirPlace = function (messageTree) {

        }
    }
]);

/* CREATE MESSAGE TREE */
function CreateMessageTree (messages) {
    let messageTree = [];
    while(messages.length > 0) {
        let m = messages.shift();
        m.children = undefined;

        if (!m.parent) {
            messageTree.push(m);
            continue;
        }

        let parent = FindParent(messageTree, m.parent.id);

        if (!parent){
            parent = FindParent(messages, m.parent.id);
            if (!parent)
                continue;
        }

        AddChild(parent, m);
    }

    return messageTree;
}

function AddChild (parent, child) {
    if (!parent.children)
        parent.children = [child];
    else
        parent.children.push(child);

    return parent;
}

function FindParent(messages, id) {
    let i = _.findIndex(messages, { id: id });
    if (i !== -1)
        return messages[i];

    for (let q = 0; q < messages.length; q++) {
        if (!messages[q].children)
            continue;

        let p = FindParent(messages[q].children, id);
        if (p)
            return p
    }

    return undefined;
}

/* FIND ACTIVE MESSAGES*/
function FindActives(messageTree) {
    let ids = [];
    for (let i = 0; i < messageTree.length; i++) {
        if (ids.indexOf(messageTree[i].sender.id) !== -1)
            continue;

        ids.push(messageTree[i].sender.id);
        messageTree[i].active = true;
    }

    return messageTree;
}

/* ORDER MESSAGES BY: */

    //STARS
function OrderByStars(messageTree) {
    return _.orderBy(messageTree, ['sender.ranking'], ['desc'])
}

    //LIKES
function OrderByLikes(messageTree) {
    messageTree = OrderByStars(messageTree);
    let liked = []
    let unliked = []

    for (let i = 0; i < messageTree.length; i++)
        if (messageTree[i].like)    liked.push(messageTree[i])
        else                        unliked.push(messageTree[i])

    return liked.concat(unliked);
}

    // FRIENDS
function OrderByFriends(messageTree) {
    return messageTree
}

    //FIFO
function OrderByFIFO (messageTree) {
    return _.orderBy(messageTree, ['send_date'])
}
