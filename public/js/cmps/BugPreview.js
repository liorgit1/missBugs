'use strict'
import { userService } from "../services/user.service.js"
export default {
  props: ['bug'],
  template: `<article class="bug-preview">
                <span>🐛</span>
                <h4>{{bug.title}}</h4>
                <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
                <span :class='"severity" + bug.severity'>description: {{bug.description}}</span>
                <div class="actions">
                  <router-link :to="'/bug/' + bug._id">Details</router-link>
                  <router-link :to="'/bug/edit/' + bug._id"> Edit</router-link>
                </div>
                <button v-if="isOwner(bug)" @click="onRemove(bug._id)">X</button>
                <h4>
                <RouterLink :to="'/user/' + bug.owner?._id">
                    Owner: {{ bug.owner?.fullname }}
                </RouterLink>
            </h4>

              </article>`,

  methods: {
    onRemove(bugId) {
      this.$emit('removeBug', bugId)
    },
    // computed: {
    isOwner(bug) {
      const user = userService.getLoggedInUser()
      if (!user) return false
      if (user.isAdmin) return true
      if (user._id !== bug.owner._id) return false
      return true
    }
    // },
  },
}


