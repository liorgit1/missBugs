'use strict'
import LoginSignup from "./LoginSignup.js"
import { userService } from "../services/user.service.js"
import { eventBus } from "../services/event-bus.service.js"

export default {
  template: `
        <header>
            <h1>Miss Bug</h1>    
            <hr />
            <section v-if="loggedinUser">
                <RouterLink :to="'/user/' + loggedinUser._id">
                    {{ loggedinUser.fullname }}
                </RouterLink>
                <button @click="logout">Logout</button>
            </section>
            <section v-else>
                <LoginSignup @onChangeLoginStatus="changeLoginStatus" />
            </section>
        </header>
    `,
    data() {
        return {
            loggedinUser: userService.getLoggedInUser()
        }
    },
    methods: {
        changeLoginStatus() {
            this.loggedinUser = userService.getLoggedInUser()
        },
        logout() {
            userService.logout()
            .then(() => {
                this.loggedinUser = null
                eventBus.emit('reloadBugs')
                })
        },
    },
    components: {
        LoginSignup
    }
}