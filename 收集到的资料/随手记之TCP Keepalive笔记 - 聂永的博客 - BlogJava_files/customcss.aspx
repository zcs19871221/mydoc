#navbar {display:none;}
.quickedit{display:none;}
pre {
 margin: 5px 20px;
 border: 1px dashed #666;
 padding: 5px;
 background: #f8f8f8;
 white-space: pre-wrap;
 white-space: -moz-pre-wrap;
 white-space: -pre-wrap;
 white-space: -o-pre-wrap;
 word-wrap: break-word;
 }
blockquote{background-color:#f7f7f7;border:1px dotted #dedbde;padding:10px;}
post-body entry-content p{
text-indent:2em;
}
#table{
border:1px solid #888888;
border-collapse:collapse;
font-family:Arial,Helvetica,sans-serif;
margin-top:10px;
width:100%;
}
#table th {
background-color:#CCCCCC;
border:1px solid #888888;
padding:5px 15px 5px 5px;
text-align:left;
vertical-align:baseline;
}
#table td {
background-color:#EFEFEF;
border:1px solid #AAAAAA;
padding:5px 15px 5px 5px;
vertical-align:text-top;
}

h1 {
    border-bottom: 1px dotted #000000;
    font-family: "Courier New",Verdana,monospace;
    font-size: 1.5em;
    margin: 0;
    padding-top: 1em;
}

table {
  width:auto !important;
  padding: 0;border-collapse: collapse; }
  table tr {
    border-top: 1px solid #cccccc;
    background-color: white;
    margin: 0;
    padding: 0; }
    table tr:nth-child(2n) {
      background-color: #f8f8f8; }
    table tr th {
      font-weight: bold;
      border: 1px solid #cccccc;
      margin: 0;
      padding: 6px 13px; }
    table tr td {
      border: 1px solid #cccccc;
      margin: 0;
      padding: 6px 13px; }
    table tr th :first-child, table tr td :first-child {
      margin-top: 0; }
    table tr th :last-child, table tr td :last-child {
      margin-bottom: 0; }

 @media print {
    table, pre {
        page-break-inside: avoid;
    }
    pre {
        word-wrap: break-word;
    }
}
code{
    padding: 0.2em;
    margin: 0;
    background-color: #f8f8f8;
    border-radius: 3px;
}

code:before,code:after{
    letter-spacing: -0.2em;
}