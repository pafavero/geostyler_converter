//url: http://localhost:3000/api/http://localhost:3000/api/

import QGISParser from "geostyler-qgis-parser";
import MapboxParser from "geostyler-mapbox-parser";
var fs = require('fs');

// DO NOT LOOK TO REACT LIBRARY: GeoStyler is an Open Source React library 
// ONLY CONVERTER  https://geostyler.github.io/geostyler/latest/index.html

// from qgis qml
// https://github.com/geostyler/geostyler-qgis-parser
// to mapbox
// https://github.com/geostyler/geostyler-mapbox-parser

export default function handler(req, res) {
  const qgisParser = new QGISParser()
  const mapboxParser = new MapboxParser()

  fs.readFile('/home/pfavero/demo/js/nextjs_geostyler/my-app2/public/test3.qml', 'utf-8', function(err, fileContent) {
    if (err) {
      onError(err);
      return;
    }
    qgisParser.readStyle(fileContent).then(({output: theirStyle}) => {
      // console.log('theirStyle', theirStyle)
      mapboxParser
        .writeStyle(theirStyle)
        .then(({output: mbStyle}) => {
          console.log('mbStyle', mbStyle)
          const mbStyleObj = JSON.parse(mbStyle)
          mbStyleObj.ADDMYDUMMYCOMMENT = 'convert /home/pfavero/demo/js/nextjs_geostyler/my-app2/public/test.qml ==> mbox'
          res.status(200).json(mbStyleObj)
        }).catch(error => {console.error(error); res.status(200).json('Error')})
    }).catch(error => {console.error(error); res.status(200).json('Error')});
  });

}



  