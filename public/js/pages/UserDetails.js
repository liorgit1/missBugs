import { userService } from "../services/user.service.js"
import { bugService } from "../services/bug.service.js"
import BugList from "../cmps/BugList.js"

export default {
    template: `
        <section class="user-details" v-if="user">
            <h5 v-if="isMyProfile">My Profile</h5>
            <pre>{{user}}</pre>
            <BugList v-if="userBugs" :bugs="userBugs"/>
        </section>
    `,
    data() {
        return {
            loggedinUser: userService.getLoggedInUser(),
            user: null,
            userBugs: null
        }
    },
    created() {
        this.loadUser()
        // this.loadUserBugs()
    },
    computed: {
        userId() {
            return this.$route.params.userId
        },
        isMyProfile() {
            if (!this.loggedinUser) return false
            return this.loggedinUser._id === this.user._id
        }
    },
    watch: {
        userId() {
            this.loadUser()
        }
    },
    methods: {
        loadUser() {
            userService.get(this.userId)
                .then(user => this.user = user)
        },
        // loadUserBugs() {
        //     bugService.query()
        //         .then(bugs => bugs.bugs.filter(bug => bug.owner._id === this.user._id))
        //         .then(bugs => this.userBugs = bugs )
        //         console.log(' this.userBugs', this.userBugs)
        // }

    },
    components: {
        BugList
    }
}