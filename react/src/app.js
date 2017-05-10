const React = require('react');
const ReactDOM = require('react-dom');
const hdfs = require('../../webhdfs-client');
const path = require('path');
const fs = require('fs');
const compression = require('compression');

class App extends React.Component {




    constructor(props) {
        super(props);
        this.getImages = this.getImages.bind(this);
        this.filterImages = this.filterImages.bind(this);
        this.filterEvent = this.filterEvent.bind(this);
        this.viewImage = this.viewImage.bind(this);
        this.filterString = '';
        this.state = {
            files: [],
            filteredfiles: [],
            previewImage: '',
        }
    }

    getImages() {
        hdfs.readdir('/tmp/', function (err, files) {
            if (err) {
                alert("Could not read files from HDFS " + err.message);
                return;
            }

            this.setState({
                files: files
            });
            this.setState({
                filteredfiles: this.filterImages(this.filterString)
            });
            console.log(files);
            console.log(err);
        }.bind(this))
    }

    viewImage(item, e) {
        const remoteFileStream = hdfs.createReadStream('/tmp/' + item.pathSuffix, {namenoderpcaddress: 'localhost:8020', offset: 0});
        let img = '';
        remoteFileStream.on('data', (chunk) => {
            img += new Buffer(chunk).toString('base64');
        });

        remoteFileStream.on('finish', (data) => {
            fs.writeFile('./test.txt', img);
            // this.setState({ previewImage: img });
        });
    }

    filterImages(filter) {
        return this.state.files.filter(function (item) {
            if (filter == '') {
                return true;
            }
            let index = item.pathSuffix.search(filter);
            return index > -1;
        })

    }

    filterEvent(event) {
        this.setState({
            filteredfiles: this.filterImages(event.target.value)
        });

    }

    componentDidMount() {
        this.getImages();
        
    }

    downloadImage() {

        remotefileStream.on('downloadFile', function () {

            const writable = hdfs.createWriteStream('./file.txt');
           

            var remoteFileStream = hdfs.createWriteStream('/tmp/' + path.basename(filepath));
            



        });

    }

    render() {
        const listitems = this.state.filteredfiles.filter(function (item) {
            let extname = path.extname(item.pathSuffix);
            return extname == '.jpg' || extname == '.png' || extname == '.dng' || extname == '.webp';
        }).map(function (item, index) {
            return <li className="list-group-item" onClick={viewImage} key={index}>{item.pathSuffix}</li>
        });

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xs-4">

                        <div>
                            <button id="openFile" className="btn-md btn-success">Upload image</button>
                        </div>
                        
                        <div>
                            <input type="text" onChange={this.filterEvent} ref={(input) => this.filterString = input} />
                        <ul className="list-group">
                            {listitems}
                        </ul>

                        <div className="row">
                            <button id="refreshBtn" onClick={this.getImages} className="btn-md btn-success">Refresh</button>
                        </div>


                        </div>
                    </div>             
                    <div className="col-xs-8">
                        Bild
                     <div>
                            <button id="downloadFile" className="btn-md btn-default-md">Download image</button>
                     </div>   
                    </div>


                </div>



            </div>


        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));