import firebase from '../plugins/firebase'
import axios from '../plugins/axios'

const authCheck = ({ store, redirect }) => {
  firebase.auth().onAuthStateChanged(async user => {
    if ( user ) {
      const { data } = await axios.get(`/v1/users?uid=${user.uid}`)
      console.log('ログイン中のユーザ：　', data)
    }
  })
}

export default authCheck
