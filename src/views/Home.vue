<template>
  <div class="elm-div container">
    <div class="doc">
      <div class="doc-nav">
        <v-card>
          <v-card-title class="dov-nav-title">
            Document Navigation
            <p><v-btn color="primary" small text @click="dialog = true">Upload pdf</v-btn></p>
          </v-card-title>
          <v-card-text>
            <ul>
              <li>Info</li>
              <li>Experience</li>
              <li>Skill</li>
              <li>Projects</li>
            </ul>
          </v-card-text>
        </v-card>
      </div>
      <div class="doc-view ml-2">
        <v-card class="view">
          <v-card-text>
            <div id="screen-capture" v-if="fileUrl.length > 0" @dblclick="clickedArea($event)">
              <div id="cap">
                <v-btn class="ok" color="success" x-small @click="takeScreenshot"><v-icon dark small> mdi-check </v-icon></v-btn>
                <v-btn class="delete" color="error" x-small @click="hideCap"><v-icon dark small> mdi-delete </v-icon></v-btn>
              </div>
              <iframe ref="fileView" id="file-view" :src="fileUrl"></iframe>
            </div>
            <p v-else>Waiting for file Upload</p>
            <!-- <pdf :src="fileUrl">
              <template slot="loading">
                Waiting for file Upload
              </template>
            </pdf> -->
          </v-card-text>
        </v-card>
      </div>
    </div>
    <v-dialog  v-model="dialog" width="500" persistent>
      <v-card id="file-upload">
        <v-card-title class="file-title">
          <p>Upload (.pdf) File Only</p>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            text
            @click="dialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="uploadFile"
          >
            Upload
          </v-btn>
        </v-card-title>

        <v-card-text>
          <div id="app" class="file-dropzone" v-cloak @drop.prevent="addFile" @dragover.prevent>
            <p v-if="files.length == 0">
              Drag here a pdf or click here to upload::
              <label for="input-file">
                <v-icon dark color="grey"> mdi-cloud-upload </v-icon>
              </label>
              <input id="input-file" type="file" name="" value="" ref="inputFile" @change="readFile" accept=".pdf">
            </p>
            <ul class="file-list" v-else>
              <li v-for="file in files">
                <span>{{ file.name }}</span> <span>({{ file.size | filterSize }})</span>
                <v-btn color="error" small text @click="removeFile(file)"><v-icon dark color="error"> mdi-delete </v-icon></v-btn>
              </li>
            </ul>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import html2canvas from 'html2canvas'

  export default {
    name: 'Home',

    components: {

    },
    data () {
      return {
        files: [],
        dialog: true,
        fileUrl: '',
        capArea: '',
      }
    },
    filters: {
      filterSize(val) {
        return `${Math.floor(val/1024)} Kb`;
      }
    },
    mounted() {
      this.capArea = document.getElementById('cap')
    },
    methods: {
      clickedArea(e) {
        this.capArea = document.getElementById('cap')
        // console.log(e, this.capArea.style);
        this.capArea.style.top = e.offsetY + 'px'
        this.capArea.style.left = e.offsetX + 'px'
        this.capArea.style.width = e.clientX - e.offsetX + 'px'
        this.capArea.style.height = e.clientY - e.offsetY + 'px'
        this.capArea.style.display = 'flex'
        console.log(this.capArea);
      },
      hideCap() {
        this.capArea = document.getElementById('cap')
        this.capArea.style.display = 'none'
      },
      takeScreenshot() {
        document.querySelector('#cap .ok').style.display = 'none';
        document.querySelector('#cap .delete').style.display = 'none';
        html2canvas(document.getElementById('cap')).then(canvas => {
          console.log(canvas.toDataURL("image/png"));
          document.querySelector('#cap .ok').style.display = 'block';
          document.querySelector('#cap .delete').style.display = 'block';
          // let croppedCanvas = document.createElement('canvas'),
          //     croppedCanvasContext = croppedCanvas.getContext('2d');
          //
          // croppedCanvas.width  = this.croppedImageWidth;
          // croppedCanvas.height = this.croppedImageHeight;
          //
          // croppedCanvasContext.drawImage(canvas, this.startX, this.startY, this.croppedImageWidth, this.croppedImageHeight, 0, 0, this.croppedImageWidth, this.croppedImageHeight);
          //
          // this.imageUrl = croppedCanvas.toDataURL();
        });
      },
      uploadFile() {
        // console.clear()
        let vm = this
        if (this.files.length > 0) {
          const store = firebase.storage().ref(`${this.files[0].name}`).put(this.files[0]).then((res) => {
            res.ref.getDownloadURL().then((rs) => {
              vm.fileUrl = rs
              vm.dialog = false
            })
          })
        }
      },
      readFile(e) {
        console.clear()
        console.log('read ', e.target.files);
        this.files = e.target.files
      },
      addFile(e) {
        // let droppedFiles = e.dataTransfer.files;
        // if(!droppedFiles) return;
         this.files = e.dataTransfer.files
        // ([...droppedFiles]).forEach(f => {
        //  this.files = f;
        // });
      },
       removeFile(file){
         this.files = []
       },
    }
  }
</script>

<style lang="scss">
#file-upload {
  .file-title {
    p {
      font-size: 20px;
      font-weight: 600;
      margin: 0px;
    }
  }
  .file-dropzone {
    border: 3px dotted #ddd;
    padding: 20px;
    height: 350px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    p {
      font-size: 18px;
      color: #989898;
      #input-file {
        display: none;
      }
    }
    .file-list {
      padding: 0px;
      list-style: none;
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 350px;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
  .elm-div {
    margin: 40px auto;
    .doc {
      display: flex;
      align-items: center;
      justify-content: center;
      .doc-nav {
        flex-basis: 20%;
        .v-card {
          height: 85vh;
        }
        .dov-nav-title {
          font-size: 18px;
          text-transform: capitalize;
          justify-content: flex-end;
        }
      }
      .doc-view {
        flex-basis: 80%;
        .v-card {
          height: 85vh;
        }
        #screen-capture {
          pointer-events: auto;
          position: relative;
          #cap {
            position: absolute;
            border: 2px solid #02fff6;
            display: none;
            justify-content: center;
            align-items: center;
            margin: 5px;
            overflow: hidden;
            resize: both;
            background: transparent;
            &::after {
              content: "";
              position:absolute;
              right: -5%;
              bottom: -15%;
              border: 10px solid #000;
              height: 0px;
              width: 0px;
              border-top: 10px solid transparent;
              border-bottom: 10px solid transparent;
              border-right: 10px solid transparent;
              transform: rotate(45deg);
            }
            .ok {
              position: absolute;
              right: 6%;
              bottom: 0%;
            }
            .delete {
              position: absolute;
              right: 20%;
              bottom: 0%;
            }
          }
          #file-view {
            height: 80vh;
            width: 100%;
            pointer-events: none;
          }
        }
      }
    }
  }
</style>
