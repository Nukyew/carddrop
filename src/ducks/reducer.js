import axios from 'axios'

const initialState = {
    cust_id: null,
    first_name: '',
    last_name: '',
    email: '',
    sub_id: null,
    sub_interval: '',
    categories: [],
    selected_cards: [],
    tree: [],
    treeLoading: false,
    tree_rel_id_index: null
}

const SET_USER_ID = "SET_USER_ID"
const GET_USER = "GET_USER"
const CLEAR_STATE = "CLEAR_STATE"
const GET_TREE = "GET_TREE"
const GET_CATEGORIES = "GET_CATEGORIES"
const ADD_TREE_ITEM = "ADD_TREE_ITEM"
const SAVE_TREE = "SAVE_TREE"
const DELETE_TREE = "DELETE_TREE"
const HANDLE_TREE_CHANGE = "HANDLE_TREE_CHANGE"
const CARD_SELECTED = "CARD_SELECTED"

export const setUserId = (userInfo) => {
    return {
        type: SET_USER_ID,
        payload: userInfo
    }
}

export const getUser = (userInfo) => {
    return {
        type: GET_USER,
        payload: userInfo
    }
}

export const clearState = () => {
    return {
        type: CLEAR_STATE
    }
}

export const getTree = (cust_id) => {
    let tree = axios.get(`/api/tree/${cust_id}`).then(res => res.data)
    return {
        type: GET_TREE,
        payload: tree
    }
}

export const getCategories = () => {
    let categories = axios.get('/api/cards/categories').then(res => res.data)
    return {
        type: GET_CATEGORIES,
        payload: categories
    }
}

export const addTreeItem = () => {
    return {
        type: ADD_TREE_ITEM
    }
}

export const saveTree = (cust_id, tree) => {
    let result = axios.post(`/api/tree/save/${cust_id}`, tree).then(res => res.data)
    return {
        type: SAVE_TREE,
        payload: result
    }
}

export const deleteTree = (cust_id, tree_rel_id) => {
    let result = axios.post('/api/tree/delete', {cust_id, tree_rel_id}).then(res => res.data)
    return {
        type: DELETE_TREE,
        payload: result
    }
}

export const handleTreeChange = (e, key, tree_rel_id) => {
    let change = {e, key, tree_rel_id}
    return {
        type: HANDLE_TREE_CHANGE,
        payload: change
    }
}

export const cardSelected = (card_id, tree_rel_id, price, img_out, card_relationship) => {
    let matchObj = {card_id, tree_rel_id, price, img_out, card_relationship}
    return {
        type: CARD_SELECTED,
        payload: matchObj
    }
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case GET_USER:
            return {...state,
                cust_id: action.payload.cust_id,
                email: action.payload.email,
                first_name: action.payload.first_name,
                last_name: action.payload.last_name,
                sub_id: action.payload.sub_id,
                sub_interval: action.payload.sub_interval}
        case SET_USER_ID:
            return {...state,
                cust_id: action.payload.cust_id,
                email: action.payload.email,
                first_name: action.payload.first_name,
                last_name: action.payload.last_name,
                sub_id: action.payload.sub_id,
                sub_interval: action.payload.sub_interval}
        case CLEAR_STATE:
            return {...state,
                cust_id: null,
                email: '',
                first_name: '',
                last_name: '',
                sub_id: null,
                sub_interval: '',
                categories: [],
                selected_cards: [],
                tree: []}
        case GET_TREE + '_PENDING':
            return {...state, treeLoading: true}
        case GET_TREE + '_FULFILLED':
            return {...state, tree: action.payload, treeLoading: false}
        case GET_CATEGORIES + '_FULFILLED':
            return {...state, categories: action.payload}
        case ADD_TREE_ITEM:
            let nextId = state.tree[state.tree.length - 1].tree_rel_id + 1
            return {...state, tree: [...state.tree, {
                tree_rel_id: nextId,
                rel_name: '',
                rel_relationship: '',
                rel_delivery: '',
                card_id: null,
                rel_bday_mo: null,
                rel_bday_day: null
            }]}
        case SAVE_TREE + '_FULFILLED':
            return {...state, tree: action.payload}
        case DELETE_TREE + '_FULFILLED':
            return {...state, tree: action.payload}
        case HANDLE_TREE_CHANGE:
            let index = state.tree.findIndex(el => el.tree_rel_id === action.payload.tree_rel_id)
            let oldTree = [...state.tree]
            oldTree[index][action.payload.key] = action.payload.e
            return {...state, tree: oldTree}
        case CARD_SELECTED:
            console.log(action.payload)
            // let selected_cards_edit_arr = [...state.selected_cards]
            // let index2 = selected_cards_edit_arr.findIndex(el => el.tree_rel_id === action.payload.tree_rel_id)
            // if (index2 === -1) {
            //     // this if statement below adds to the end of selected_cards. Hopefully not a problem.
            //     selected_cards_edit_arr.push({
            //         tree_rel_id: action.payload.tree_rel_id,
            //         card_id: action.payload.card_id,
            //         price: action.payload.price,
            //         img_out: action.payload.img_out,
            //         card_relationship: action.payload.relationship
            //     })
            // } else if (index2 !== -1){
            //     selected_cards_edit_arr.splice(index2, 1, {
            //         tree_rel_id: action.payload.tree_rel_id,
            //         card_id: action.payload.card_id,
            //         price: action.payload.price,
            //         img_out: action.payload.img_out,
            //         card_relationship: action.payload.relationship
            //     })
            // }
            // return {...state, selected_cards: selected_cards_edit_arr}
            return {...state}
        default:
            return state
    }
}

export default reducer