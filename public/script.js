const PRICE = 9.99
const LOAD_NUM = 10

new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [],
        cart: [],
        results: [],
        search: 'anime',
        lastSearch: '',
        loading: false,
        price: PRICE
    },
    methods: {
        appendItems: function() {
            if (this.items.length < this.results.length) {
                var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
                this.items = this.items.concat(append);
            }
        },
        onSubmit: function() {
            this.items = []
            this.loading = true
            this.$http
            .get('/search/'.concat(this.search))
            .then(function (res) {
                this.results = res.data
                this.items = res.data.slice(0, LOAD_NUM)
                this.lastSearch = this.search
                this.search = ''
                this.loading = false
            })
            this.appendItems()
        },
        addItem: function(index) {
            var item = this.items[index];
            var found = false
            for(var i = 0; i < this.cart.length; i++) {
                if (this.cart[i].title === item.title) {
                    found = true
                    this.cart[i].qty++
                    break
                }
            }
            if (!found) {
                this.cart.push({
                    title: item.title,
                    qty: 1,
                    price: PRICE
                })
            }
            this.total += PRICE
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

        var vueInstance = this;
        var elem = document.getElementById('product-list-bottom');
        var watcher = scrollMonitor.create(elem)
        watcher.enterViewport(function () {
            vueInstance.appendItems()
        })
    }
});
