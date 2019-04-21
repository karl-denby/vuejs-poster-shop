new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [],
        cart: [],
        search: 'anime',
        lastSearch: '',
        loading: false,
        price: 9.99
    },
    methods: {
        onSubmit: function() {
            this.items = []
            this.loading = true
            this.$http
            .get('/search/'.concat(this.search))
            .then(function (res) {
                this.items = res.data
                this.lastSearch = this.search
                this.search = ''
                this.loading = false
            })
        },
        addItem: function(index) {
            var item = this.items[index];
            var found = false
            for(var i = 0; i < this.cart.length; i++) {
                if (this.cart[i]._id === item._id) {
                    found = true
                    this.cart[i].qty++
                    break
                }
            }
            if (!found) {
                this.cart.push({
                    _id: item._id,
                    title: item.title,
                    qty: 1,
                    price: item.price
                })
            }
            this.total += this.items[index].price
        },
        inc: function(item){
            item.qty++;
            this.total += item.price
        },
        dec: function(item){
            item.qty--;
            this.total -= item.price
            if (item.qty <= 0) {
                for (var i = 0 ; i < this.cart.length; i++) {
                    if (this.cart[i]._id === item._id) {
                        this.cart.splice(i, 1)
                        break
                    }
                }
            }
        },
    },
    filters: {
        currency: function(price) {
            return '$'.concat(price.toFixed(2));
        }
    },
    mounted: function() {
        this.onSubmit()
    }
});