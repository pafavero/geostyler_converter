import SLDParser from "geostyler-sld-parser";
import QGISParser from "geostyler-qgis-parser";
import MapboxParser from "geostyler-mapbox-parser";
var fs = require('fs');
const utf8 = require('utf8');


// DO NOT LOOK TO REACT LIBRARY: GeoStyler is an Open Source React library 
// ONLY CONVERTER  https://geostyler.github.io/geostyler/latest/index.html

// from qgis qml
// https://github.com/geostyler/geostyler-qgis-parser
// to mapbox
// https://github.com/geostyler/geostyler-mapbox-parser


export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }else{
    let qmlContent = req.body
    qmlContent = '<!DOCTYPE' +qmlContent.split('<!DOCTYPE')[1]
    qmlContent = qmlContent.split('</qgis>')[0] + '</qgis>'
    qmlContent = JSON.parse( JSON.stringify( qmlContent ) )
    
    console.log('qmlContent', qmlContent)
    // console.log('req', req)
    const qgisParser = new QGISParser()
    const mapboxParser = new MapboxParser()

    qgisParser.readStyle(qmlContent).then(({output: theirStyle}) => {
      console.log('theirStyle', theirStyle)
      mapboxParser
        .writeStyle(theirStyle)
        .then(({output: mbStyle}) => {
          console.log('mbStyle', mbStyle)
          res.status(200).json(mbStyle)      
        }).catch(error => {
          console.error(error)
          res.status(200).json('error')
        })
    }).catch(error => {
      console.error(error)
      res.status(200).json('error')
    });
    // res.status(200).json('ok')
  }
}
