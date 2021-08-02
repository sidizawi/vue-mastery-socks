Vue.config.devtools = true

Vue.component('nav-bar', {
    props: {
        brand: {
            type: String,
            required: true,
            default: 'Socks'
        },
        cart: {
            type: Number,
            required: true,
            default: 0
        }
    },
    template: `
    <div class="nav-bar">
        <h1>{{ brand }}</h1>
        <ul>
            <li>Home</li>
            <li>Category</li>
            <li>Cart ({{ cart }})</li>
        </ul>
    </div>
    `,
})

Vue.component('product', {
    props: {
        brand: {
            type: String,
            required: true,
            default: 'Socks'
        },
        premium: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    template: `
    <div class="product">
        <div class="product-image">
            <img :src="image"/>
        </div>
        <div class="product-info">
            <h2>{{ title }}</h2>
            <p v-if="inStock">In Stock</p>
            <p v-else>Out of Stock</p>
            <p>Shipping: {{ premium ? 'Free' : '2.99' }}</p>
            
            <ul>
                <li v-for="detail in details" :key="detail">{{ detail }}</li>
            </ul>

            <div v-for="(variant, index) in variants"
                :key="variant.variantId"
                class="color-box"
                :style="{backgroundColor: variant.variantColor}"
                @mouseover="updateVariant(index)"
                >
            </div>

            <button @click="addToCart"
                :disabled="!inStock"
                :class="{disabledButton : !inStock}"
            >
                Add to cart
            </button>

            <button @click="removeFromCart"
                :disabled="!inStock"
                :class="{disabledButton : !inStock}"
            >
                Remove
            </button>

        </div>
    </div>
    `,
    data() {
        return {
            product: 'Socks',
            selectVariant: 0,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: 'https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg',
                    variantQuantity: 10,
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: 'https://www.vuemastery.com/images/challenges/vmSocks-blue-onWhite.jpg',
                    variantQuantity: 0,
                }
            ],
        }
    },
    methods: {
        updateVariant: function(index) {
            this.selectVariant = index
        },
        addToCart: function() {
            this.$emit('add-to-cart', this.variants[this.selectVariant].variantId)
        },
        removeFromCart: function() {
            this.$emit('remove-from-cart', this.variants[this.selectVariant].variantId)
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectVariant].variantQuantity
        }
    }
})

Vue.component('product-review', {
    template: `
    <div class="review">
        <span v-for="(tab, index) in tabs" 
            :key="index"
            :class="{activeTab : selectedTab == tab}"
            @click="selectedTab = tab"
            class="tab"
        >
            {{ tab }}
        </span>

        <div v-show="selectedTab == 'Reviews'">
            <h2>Reviews</h2>
            <p v-if="!reviews.length">there are no reviews yet.</p>
            <ul v-else>
                <li v-for="review in reviews">
                    <p>Name: {{ review.name }}</p>
                    <p>Review: {{ review.review }}</p>
                    <p>{{ review.rating }}</p>
                </li>
            </ul>
        </div>

        <review-form
            v-show="selectedTab  == 'Make a Review'" 
            @review-response="updateReview"
        >
        </review-form>
    </div>
    `,
    data() {
        return {
            reviews: [],
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    },
    methods: {
        updateReview(reviewResponse) {
            this.reviews.push(reviewResponse)
        }
    }
})

Vue.component('review-form', {
    template: `
    <form class="review-form" @submit.prevent="sendReview">
        <p v-if="errors.length">
            <b>Please correct the following error{{ errors.length == 1 ? '' : 's' }}</b>
            <ul>
                <li v-for="(error, index) in errors" :key="index">{{error}}</li>
            </ul>
        </p>
        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name" placeholder="name">
        </p>

        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>

        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option v-for="x in 5" :key="x">{{ 6-x }}</option>
            </select>
        </p>

        <p>
            <input type="submit" value="Submit">
        </p>
    </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        sendReview() {
            if (this.name && this.review && this.rating) {
                let reviewResponse = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                this.$emit('review-response', reviewResponse)
            }
            else {
                this.errors = []
                if (!this.name) this.errors.push('Name required')
                if (!this.review) this.errors.push('Review required')
                if (!this.rating) this.errors.push('Rating required')
            }
            this.name = null
            this.review = null
            this.rating = null
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
        brand: 'Vue Mastery',
        cart: [],
        premium: true,
    },
    methods: {
        addToCart(variantId) {
            this.cart.push(variantId)
        },
        removeFromCart(variantId) {
            count = 1
            this.cart = this.cart.filter(x => !count || (count -= x == variantId))
        }
    }
})
