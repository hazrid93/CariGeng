<template>
        <v-container fluid fill-height>
            <!-- justify-content (vertical), align-items (horizontal) 
                Note:cannot control xs6 sizes if use column layout -->
                <!-- <div ref="mapaa" style="height: 400px; width: 700px;"></div> -->
                <v-layout justify-center row wrap>
                    <v-flex xs12 sm12 md4 :class="{'pb-4': paddingBottom, 'pr-4': paddingRight}">
                        <v-layout justify-center>
                            <v-dialog v-model="dialogPostEvent" fullscreen hide-overlay transition="dialog-bottom-transition">
                                <v-btn round outline class="ma-0 text-md-center" slot="activator" color="primary" dark>Create Event</v-btn>
                                <v-card>
                                    <v-toolbar dark color="black">
                                        <v-btn icon dark @click="dialogPostEvent = false">
                                            <v-icon>close</v-icon>
                                        </v-btn>
                                    <v-toolbar-title>Create Event</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                    <v-toolbar-items>
                                        <v-btn dark flat @click="createEvent(); dialogPostEvent = false">Send</v-btn>
                                    </v-toolbar-items>
                                    </v-toolbar>
                                    <!--event form section-->  
                                        <v-layout mt-4 justify-center row wrap style="height: inherit;">
                                            <v-flex xs10 sm10 md8>
                                                <v-form ref="form" lazy-validation>  
                                                    <h6 class="title">Title</h6>  
                                                    <v-text-field v-model.trim="event.title" required single-line></v-text-field>
                                                   <!-- TipTap implementation here to replace normal text field
                                                       <v-text-field v-model.trim="event.content" label="Content" required ></v-text-field> -->
                                                    <h6 class="title">Content</h6>
                                                    <div class="editor" style="margin-top: 20px; margin-bottom: 20px; border: 2px solid grey; border-radius: 5px; padding-left: 20px; padding-right: 20px">
                                                        
                                                        <editor-menu-bar :editor="editor">
                                                            <div class="menubar" slot-scope="{ commands, isActive }">
                                                            <div class="toolbar">
                                                            <button class="menubar__button" :class="{ 'is-active': isActive.bold() }" @click.prevent="commands.bold" > <icon name="bold" /> </button>

                                                            <button class="menubar__button" :class="{ 'is-active': isActive.italic() }" @click.prevent="commands.italic" > <icon name="italic" /> </button>

                                                            <button class="menubar__button" :class="{ 'is-active': isActive.strike() }" @click.prevent="commands.strike" > <icon name="strike" /> </button>

                                                            <button class="menubar__button" :class="{ 'is-active': isActive.underline() }" @click.prevent="commands.underline" > <icon name="underline" /> </button>

                                                            <button class="menubar__button" :class="{ 'is-active': isActive.code() }" @click.prevent="commands.code" > <icon name="code" /> </button>

                                                            <button class="menubar__button" :class="{ 'is-active': isActive.paragraph() }" @click.prevent="commands.paragraph" > <icon name="paragraph" /> </button>

                                                            <button class="menubar__button" :class="{ 'is-active': isActive.heading({ level: 1 }) }" @click.prevent="commands.heading({ level: 1 })" > H1 </button>

                                                            <button class="menubar__button" :class="{ 'is-active': isActive.heading({ level: 2 }) }" @click.prevent="commands.heading({ level: 2 })" > H2 </button>

                                                            <button class="menubar__button" :class="{ 'is-active': isActive.heading({ level: 3 }) }" @click.prevent="commands.heading({ level: 3 })" > H3 </button>

                                                            <button class="menubar__button" :class="{ 'is-active': isActive.bullet_list() }" @click.prevent="commands.bullet_list" > <icon name="ul" /> </button>

                                                            <button class="menubar__button" :class="{ 'is-active': isActive.ordered_list() }" @click.prevent="commands.ordered_list" > <icon name="ol" /> </button>

                                                            <button class="menubar__button" :class="{ 'is-active': isActive.blockquote() }" @click.prevent="commands.blockquote" > <icon name="quote" /> </button>

                                                            <button class="menubar__button" :class="{ 'is-active': isActive.code_block() }" @click.prevent="commands.code_block" > <icon name="code" /> </button>

                                                            <button class="menubar__button" @click.prevent="commands.horizontal_rule" > <icon name="hr" /> </button>

                                                            <button class="menubar__button" @click.prevent="commands.undo" > <icon name="undo" /> </button>

                                                            <button class="menubar__button" @click.prevent="commands.redo" > <icon name="redo" /> </button>
                                                            
                                                            <!-- table part here -->
                                                            <button class="menubar__button" @click.prevent="commands.createTable({rowsCount: 3, colsCount: 3, withHeaderRow: false })" > <icon name="table" /> </button>

                                                                <span v-if="isActive.table()">
                                                                    <button class="menubar__button" @click.prevent="commands.deleteTable" > <icon name="delete_table" /> </button>
                                                                    <button class="menubar__button" @click.prevent="commands.addColumnBefore" > <icon name="add_col_before" /> </button>
                                                                    <button class="menubar__button" @click.prevent="commands.addColumnAfter" > <icon name="add_col_after" /> </button>
                                                                    <button class="menubar__button" @click.prevent="commands.deleteColumn" > <icon name="delete_col" /> </button>
                                                                    <button class="menubar__button" @click.prevent="commands.addRowBefore" > <icon name="add_row_before" /> </button>
                                                                    <button class="menubar__button" @click.prevent="commands.addRowAfter" > <icon name="add_row_after" /> </button>
                                                                    <button class="menubar__button" @click.prevent="commands.deleteRow" > <icon name="delete_row" /> </button>
                                                                    <button class="menubar__button" @click.prevent="commands.toggleCellMerge" > <icon name="combine_cells" /> </button>
                                                                </span>
                                                            </div>
                                                            </div>
                                                        </editor-menu-bar>

                                                        <editor-content class="editor__content" :editor="editor" />
                                                    </div>

                                                    <div class="actions" style="margin-bottom: 20px;" >
                                                        <v-btn round outline dark color="primary" @click.prevent="clearContent">Clear Content</v-btn>
                                                        <!--
                                                        <button class="button" @click.prevent="setContent">
                                                            Set Content
                                                        </button> -->
                                                        

                                                        <!--
                                                        <div class="export">
                                                        <h3>JSON</h3>
                                                        <pre><code v-html="json"></code></pre>

                                                        <h3>HTML</h3>
                                                        <pre><code>{{ html }}</code></pre>
                                                        </div> -->
                                                    </div>
                                                    <h6 class="title">Address</h6>
                                                    <v-text-field v-model.trim="event.address" required single-line ></v-text-field>
                                                    <h6 class="title">City</h6>
                                                    <v-text-field v-model.trim="event.city" required single-line></v-text-field>
                                                    <h6 class="title">State</h6>
                                                    <v-text-field v-model.trim="event.state" required single-line></v-text-field>
                                                    <h6 class="title">Country</h6>
                                                    <v-text-field v-model.trim="event.country" required single-line></v-text-field>
                                                    <h6 class="title">Latitude</h6>
                                                    <v-text-field v-model="event.latitude" type="number" required single-line></v-text-field>
                                                    <h6 class="title">Longitude</h6>
                                                    <v-text-field v-model="event.longitude" type="number" required single-line></v-text-field>
                                                </v-form>
                                            </v-flex>
                                        </v-layout>
                                  
                                </v-card>
                            </v-dialog>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12 sm12 md8>
                       <!-- event details when clicked -->
                        <v-dialog v-model="dialogEvent" scrollable max-width="100%" max-height="100%">
                            
                            <v-card>
                                <v-card-title>Event Details</v-card-title>
                                <v-divider></v-divider>
                                
                                <v-card-text>
                                    <h6 class="title" style="text-decoration: underline">Title</h6>
                                    <p style="padding-top:10px; margin-bottom: 20px;">{{ currentEvent.title }}</p>
                           
                                    <h6 class="title" style="text-decoration: underline">Created By</h6>
                                    <p style=" padding-top:10px; margin-bottom: 20px;">{{ currentEvent.userName }}</p>

                                    <h6 class="title" style="text-decoration: underline">Event Information</h6>
                                    <div style=" padding-top:10px; margin-bottom: 20px;" v-html="currentEvent.content"></div>

                                    <h6 class="title" style="text-decoration: underline">Location</h6>
                                    <div style=" padding-top:10px; margin-bottom: 20px;">
                                    <div v-if="mapBoolean" ref="mapCanvas" style="height: 350px; width: 100%;"></div>
                                    <div v-else style="height: 350px; width: 100%;"><p>No location specified for this event</p></div>
                                    </div>
                                </v-card-text>

                                
                                
                                <v-divider></v-divider>
                                <v-card-actions>
                                <v-btn color="blue darken-1" flat @click="dialogEvent = false">Close</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                        <div v-if="events.length">
                            <template v-for="(event, index) in events">
                                <v-card :key="event.title" class="mb-4">
                                    <v-img src="https://cdn.vuetifyjs.com/images/cards/house.jpg" height="200px" > 
                                    <v-container fill-height fluid >
                                        <v-layout fill-height align-start>
                                        <v-flex xs12 flexbox>
                                           <!-- <span class="headline white--text" v-text="event.title"></span> -->
                                        </v-flex>
                                        </v-layout>
                                    </v-container>
                                    </v-img>
                                   
                                    <v-card-actions>
                                        <v-card-title primary-title>
                                            <div>
                                                <div class="headline"><a style="text-decoration: none; color: inherit;" @click="expandEvent(event); dialogEvent = true">{{ event.title | trimCardText }}</a></div>
                                                <span class="grey--text">{{ event.createdOn | formatDate }}</span>
                                                <p style="padding: 0; margin: 0" class="grey--text">By: {{ event.userName }}</p>
                                                <p style="padding: 0; margin: 0" class="grey--text">{{ event.likes }} likes</p>
                                            </div>

                                        </v-card-title>
                                        <v-spacer></v-spacer>
                                        <!--
                                        <v-list-tile-content>
                                            <v-list-tile-title class="text-xs-center">{{ event.userName }}</v-list-tile-title>
                                            <v-list-tile-title class="text-xs-center">{{ event.likes }} likes</v-list-tile-title>
                                        </v-list-tile-content> -->

                                        <v-btn icon>
                                            <v-icon @click="likeEvent(event)">favorite</v-icon>
                                        </v-btn>
                                        <v-btn icon>
                                            <v-icon>bookmark</v-icon>
                                        </v-btn>

                                       

                                    </v-card-actions>
                                </v-card>
                            </template>
                        </div>
                        <div v-else>
                            <p>There are currently no event</p>
                        </div>
                    </v-flex>
                </v-layout>
        </v-container>   
       
</template>

<script>
    import { mapState } from 'vuex'
    import moment from 'moment'
    import Icon from './Icon.vue'
    import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
    import {
    Blockquote,
    CodeBlock,
    HardBreak,
    Heading,
    HorizontalRule,
    OrderedList,
    BulletList,
    ListItem,
    TodoItem,
    TodoList,
    Bold,
    Code,
    Italic,
    Link,
    Strike,
    Underline,
    History,
    Table,
    TableHeader,
    TableCell,
    TableRow
    } from 'tiptap-extensions'
    const fb = require('../../firebaseConfig.js')

    export default {
        data() {
            return { 
                event: {
                    title: '',
                    about: '',
                    address: '',
                    city: '',
                    state: '',
                    country: '',
                    latitude: 0.0,
                    longitude: 0.0,
                    content: ''
                },
                dialogPostEvent: false,
                dialogEvent: false,
                notifications: false,
                sound: true,
                widgets: false,
                paddingBottom: false,
                paddingRight: false,
                currentEvent: {},
                map: {},
                mapMarker: {},
                mapBoolean: true,
                //tiptap part
                editor: new Editor({
                    extensions: [
                    new Blockquote(),
                    new BulletList(),
                    new CodeBlock(),
                    new HardBreak(),
                    new Heading({ levels: [1, 2, 3] }),
                    new HorizontalRule(),
                    new ListItem(),
                    new OrderedList(),
                    new TodoItem(),
                    new TodoList(),
                    new Bold(),
                    new Code(),
                    new Italic(),
                    new Link(),
                    new Strike(),
                    new Underline(),
                    new History(),
                    new Table(),
                    new TableHeader(),
                    new TableCell(),
                    new TableRow()
                    ],
                    content: `
                      <br>
                      <br>
                      <br>
                    `,
                    onUpdate: ({ getJSON, getHTML }) => {
                        this.json = getJSON()
                        
                        this.html = getHTML()
                        this.event.content = this.html
                    }
                   
                }),
                json: 'Update content to see changes',
                html: 'Update content to see changes',
            }   
        },
        components: {
            EditorContent,
            EditorMenuBar,
            Icon
        },
        computed: {
            //use mapState to get access to all state properties or
            //use mapGetters to get all the getters specified in store.js
            //will use mapState for now
 
            ...mapState(['userProfile','currentUser','events'])
        },
        methods: {
            onResize () {
              //  console.log(this.$vuetify.breakpoint.name)
                if(this.$vuetify.breakpoint.name=="xs" || this.$vuetify.breakpoint.name=="sm"){          
                    this.paddingBottom = true
                    this.paddingRight = false
                } else {
                    this.paddingBottom = false
                    this.paddingRight = true
                }
                
            },
            createEvent() {
                console.log("create event called")
                fb.eventsCollection.add({
                    createdOn: new Date(),
                    title: this.event.title,
                    userId: this.currentUser.uid,
                    userName: this.userProfile.name,
                    address: this.event.address,
                    content: this.event.content,
                    city: this.event.city,
                    state: this.event.state,
                    country: this.event.country,
                    latitude: parseFloat(this.event.latitude),
                    longitude: parseFloat(this.event.longitude),
                    likes: 0

                }).then(ref => {
                    
                }).catch(err => {
                    console.log(err)
                })
            },
            likeEvent(event){
                let docId = `${this.currentUser.uid}_${event.id}`
                
                //search based on this id (docId)
                fb.eventslikesCollection.doc(docId).get().then(doc => {
                    //this part make sure same user doesnt like twice
                    if (doc.exists) {
                        return
                    }
                    fb.eventslikesCollection.doc(docId).set({
                        eventId: event.id,
                        userId: this.currentUser.uid
                    }).then(() => {
                        // update event likes
                        fb.eventsCollection.doc(event.id).update({
                            likes: event.likes + 1
                        })
                    })
                }).catch(err => {
                    console.log(err)
                })
            },
            expandEvent(event){
                this.currentEvent = event

                var latitudeval = this.currentEvent.latitude;
                var longitudeval = this.currentEvent.longitude;
                
                if(latitudeval != null && longitudeval != null){
                    this.mapBoolean = true
                    //console.log("true")
                } else {
                     this.mapBoolean = false
                     //console.log("false")
                     return
                }
                
                this.map = new google.maps.Map(this.$refs.mapCanvas, {
                    zoom: 19,
                    center: new google.maps.LatLng(latitudeval,longitudeval)
                });
                
                this.mapMarker = new google.maps.Marker({
                    position: new google.maps.LatLng(latitudeval,longitudeval),
                    map: this.map,
                    title: 'We are here!'
                });
            },
            clearContent() {
                this.editor.clearContent(true)
                this.editor.focus()
            },
            setContent() {
                // you can pass a json document
                this.editor.setContent({
                    type: 'doc',
                    content: [{
                    type: 'paragraph',
                    content: [
                        {
                        type: 'text',
                        text: 'This is some inserted text. 👋',
                        },
                    ],
                    }],
                }, true)
                // HTML string is also supported
                // this.editor.setContent('<p>This is some inserted text. 👋</p>')
                this.editor.focus()
            }
        },
        filters: {
            formatDate(val) {
                if (!val) { return '-' }
                let date = val.toDate()
                return moment(date).format('MMMM Do YYYY, h:mm:ss a');
            },
            trimLength(val) {
                if (val.length < 200) { return val }
                return `${val.substring(0, 200)}...`
            },
            trimCardText(val) {
                if (val.length < 30) { return val }
                return `${val.substring(0, 30)}...`
            }
        },
        mounted () {
            this.onResize()
            window.addEventListener('resize', this.onResize, { passive: true })
        },
        beforeDestroy () {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', this.onResize, { passive: true })
            }
            // destroy tiptap editor
            this.editor.destroy()
        }
    }
</script>

<style scoped>
.menubar__button.is-active {
    background-color: rgba(0,0,0,.1); 
}

.menubar__button:hover {
    background-color: rgba(0,0,0,.05);
}

.menubar__button {
    font-weight: 700;
    /*display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;*/
    background: rgba(0,0,0,0);
    border: 0;
    color: #000;
    padding: .2rem .5rem;
    margin-right: .2rem;
    border-radius: 3px;
    cursor: pointer;
}

.menubar {
    margin-bottom: 1rem;
    -webkit-transition: visibility .2s .4s,opacity .2s .4s;
    transition: visibility .2s .4s,opacity .2s .4s;
}

</style>

<style>
/*
.editor__content div .tableWrapper {
    margin: 1em 0;
    overflow-x: auto;
}

.editor__content div div .tableWrapper table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;
}

.editor__content div .tableWrapper table td, .editor__content div .tableWrapper table th {
    min-width: 1em;
    border: 2px solid #ddd;
    padding: 3px 5px;
    vertical-align: top;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
    border-color: blue;
}

.editor__content * {
    caret-color: currentColor;
}

*/
.editor__content table td {
    min-width: 1em;
    border: 2px solid #ddd;
    padding: 3px 5px;
    vertical-align: top;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
    border-color: grey;
}

.editor__content table tr {
    min-width: 1em;
    border: 2px solid #ddd;
    padding: 3px 5px;
    vertical-align: top;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
    border-color: grey;
}

.editor__content table th {
    min-width: 1em;
    border: 2px solid #ddd;
    padding: 3px 5px;
    vertical-align: top;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
    border-color: grey;
}

.editor__content .tableWrapper table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;
}


.editor__content .tableWrapper {
    margin: 1em 0;
    overflow-x: auto;
}

</style>
