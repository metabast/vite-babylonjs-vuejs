class Node{
    constructor(val){
        this.val = val;
        this.next = null;
    }
}

class SinglyLinkedList{
    constructor(){
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    push(val){
        const node = new Node(val);
        if(!this.head){
            this.head = this.tail = node;
        }else{
            this.tail.next = node;
            this.tail = node;
        }
        this.length ++;
        return node;
    }

    pop(){
        if(!this.head) return undefined;

        let current = this.head;
        let newTail = current;
        let prev = null;
        while(current.next){
            newTail = current;
            current = current.next;
        }
        this.tail = newTail;
        this.tail.next = null;
        this.length --;
        if(this.length === 0){
            this.head = this.tail = null;
        }
        return current;
    }

    shift(){
        if(!this.head){
            return undefined;
        }
        const currentHead = this.head;
        this.head = currentHead.next;
        this.length --;
        
        if(this.length === 0){
            this.tail = null;
        }

        return currentHead;
    }

    unshift(val){
        if(!val) return undefined;

        const node = new Node(val);
        if(!this.head){
            this.head = this.tail = node;
        }else{
            node.next = this.head;
            this.head = node;
        }
        this.length ++;
        return this;
    }

    get(index){
        if(index < 0 || index >= this.length) return undefined;
        let currentIndex = 0;
        let currentNode = this.head;
        while(currentIndex !== index){
            currentNode = currentNode.next;
            currentIndex ++;
        }
        return currentNode;
    }
    set(index, val){
        const foundNode = this.get(index);
        if(foundNode){
            foundNode.val = val;
            return true;
        } 
        return false;
    }

    insert(index, val){
        if(index === 0){
            return !!this.unshift(val);
        }
        if(index === this.length){
            return !!this.push(val);
        }
        const prevNode = this.get(index - 1);
        if(prevNode){
            const newNode = new Node(val);
            newNode.next = prevNode.next;
            prevNode.next = newNode;
            this.length ++;
            return true;
        } 
        return false;
    }

    remove(index){
        if(index === 0){
            return !!this.shift();
        }
        if(index === this.length){
            return !!this.pop();
        }
        const prevNode = this.get(index - 1);
        if(prevNode){
            const removed = prevNode.next;
            prevNode.next = removed.next;
            this.length --;
            return removed;
        }
        return false;
    }

    reverse(){
        if(!this.length)
            return false;
        this.node = this.head;
        this.head = this.tail;
        this.tail = this.node;
        let next;
        let prev = null;
        for (let i = 0; i < this.length; i++) {
            next = this.node.next;
            this.node.next = prev;
            prev = this.node;
            this.node = next;
        }
        return this;
    }
}

export {SinglyLinkedList};