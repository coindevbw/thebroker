// const repoPath = 'ipfs-' + Math.random()
// // Create an IPFS node
// const node = new Ipfs({
//   init: false,
//   start: false,
//   repo: repoPath
// })
// // Init the node
// node.init(handleNodeInit)

// function handleNodeInit (err) {
//   if (err) {
//     throw err
//   }
//   node.start(() => {
//     console.log('Online status: ', node.isOnline() ? 'online' : 'offline')
//     //document.getElementById("status").innerHTML= 'Node status: ' + (node.isOnline() ? 'online' : 'offline')
//     // You can write more code here to use it. Use methods like 
//     // node.files.add, node.files.get. See the API docs here:
//     // https://github.com/ipfs/interface-ipfs-core/tree/master/API
//   })
// }

var enumStatus;
(function (enumStatus) {
    enumStatus[enumStatus["Created"] = 0] = "Created";
    enumStatus[enumStatus["Validated"] = 1] = "Validated";
    enumStatus[enumStatus["Locked"] = 2] = "Locked";
    enumStatus[enumStatus["Finished"] = 3] = "Finished";
})(enumStatus|| (enumStatus= {}));

var enumFileStatus;
(function (enumFileStatus) {
    enumFileStatus[enumFileStatus["Created"] = 0] = "Created";
    enumFileStatus[enumFileStatus["Invalidated"] = 1] = "Invalidated";
})(enumFileStatus|| (enumFileStatus= {}));


function loadAccountData(span_account, span_balance) {
  web3.eth.getAccounts(function(e,accounts){ 
    if (e) {
      console.log(e);
      $(span_account).html(
        '<a href="javascript:void(0)" onclick="showHowto()">*********</a>');
      showHowto();
      return
    }
    var _account = accounts[0];
    if(_account==null){
      var msg  = "__HOWTO__";
      $(span_account).html(
        '<a href="javascript:void(0)" onclick="showHowto()">*********</a>');
      showHowto();
      return;
    }
    var link = "<a href=\"https://ropsten.etherscan.io/address/" + _account + "\">" + _account +"</a>"
    if(App.netId==1){
      link = "<a href=\"https://etherscan.io/address/" + _account + "\">" + _account +"</a>"
    }
    $(span_account).html(link);
    
    web3.eth.getBalance(_account, undefined, function (error, result) {
      if (!error) {
        var bal = web3.fromWei(result, 'ether');
        $(span_balance).text(bal + "ETH");
      }
      else
        console.error(error);
    });
  });
}

function scrollToTab(name) {
  if ($('.section-tabs').length != 0) {
        $("html, body").animate({
            scrollTop: $('.section-tabs').offset().top

        }, 1000);

        $('#tabs a[href="'+name+'"]').click();
    }
}

function addContractInfoToTable(timestamp, newcontract, middlemanexists, type){
  var date = new Date(timestamp* 1000).toLocaleString();
  var trid = newcontract;
  row = $("<tr id=\""+ trid +"\" class></tr>");
  
  console.log(
    "middlemanexists : " + middlemanexists
    + ", newcontract : " + newcontract
    + ", date : " + date
    );
  col1 = $("<td class=\"created\"><span style=\"font-weight: bold;\" class=\"value\">"+ date +"</span></td>");
  col2 = $("<td class=\"middlemanexists\"><span style=\"font-weight: bold;\" class=\"value\">"+middlemanexists+"</span></td>");
  col3 = $("<td class=\"status\"><span style=\"font-weight: bold;\" class=\"value\"></span></td>");
  col4 = $("<td class=\"type\"><span style=\"font-weight: bold;\" class=\"value\">"+ type + "</span></td>");
  col5 = $("<td class=\"name\"><span style=\"font-weight: bold;\" class=\"value\">"+ "</span></td>");
  col6 = $("<td class=\"price\"><span style=\"font-weight: bold;\" class=\"value\">"+ "</span> ETH</td>");
  row.append(col1,col2,col3,col4,col5,col6).prependTo('#tablebody_select_contract'); 
}

function addContractEventlog(blocknumber, message){
  //var date = new Date(timestamp* 1000).toLocaleString();
  row = $("<tr></tr>");
  col1 = $("<td class=\"blocknumber\"><span style=\"font-weight: bold;\" class=\"value\">"+ blocknumber +"</span></td>");
  col2 = $("<td class=\"message\"><span style=\"font-weight: bold;\" class=\"value\">"+message+"</span></td>");
  row.append(col1,col2).prependTo('#tableGame1Events'); 
}

function resetContractListTableSelectionEvent()
{
  $("#tablebody_select_contract > tbody tr").click(function () {
    $('.selected_contract').removeClass('selected_contract');
    $(this).addClass("selected_contract");
    //
    $cur_selected_contract = this.id;
    App.initContract($cur_selected_contract);
  });
}

function showPleaseWait(_show)
{
  if(_show){
    $('#modalPleaseWait').modal('show'); 
  }
  else
  {
    //$("#progress_overlay").hide();
    $('#modalPleaseWait').modal('hide'); 
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }
}

function disableSellerBuyerBrokerAndItemInfo(disable)
{
  $('#changeinfo *').prop( "disabled", disable );
  $('#div_seller_buyer_and_broker *').prop( "disabled", disable );
}

function showHowto() {
  //scrollToTab('#tab_howto');
  $('#modalHowto').modal('show');
}

function scrollToTop() {
    $("html, body").animate({
        scrollTop: 0
    }, 1000);
}


App = {
  web3Provider: null,
  contracts: {},
  instance: null,
  factoryInstance: null,
  itemprice : 0,
  isbroker:false,

  init: function() {
    if (typeof(Storage) !== "undefined") {
    } else {
        console.log("OOOPS, No localStorage.");
    }

    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8546');
      web3 = new Web3(App.web3Provider);
    }

    web3.version.getNetwork((err, netId) => {
       if (err) {
        console.log(err);
        $('.account').html(
         '<a href="javascript:void(0)" onclick="showHowto()">*********</a>');
        showHowto();
        return
      }
      var factorycontractAddress = "0xf3021a6c271d044dc5f6181bbf7bfbaf9fe16538";
      var ethescanaddr = "https://etherscan.io/address/";
      switch (netId) {
        case "1":
          console.log('This is mainnet')
          break
        case "2":
          console.log('This is the deprecated Morden test network.')
          break
        case "3":
          ethescanaddr = "https://ropsten.etherscan.io/address/";
          factorycontractAddress = "0x39c032f501d4dd99ccd1e4d76699a97e1087404f";
          console.log('This is the ropsten test network.')
          break
        default:
          console.log('Maybe testnet')
          showHowto();
          return;
      }

      // Ropsten
      App.initFactoryContract(factorycontractAddress);
      $("a.contract_address").attr("href", ethescanaddr+factorycontractAddress+"#code");
      

      loadAccountData('.account','.balance');
    });
  },

  startMonitoringEvent: function(){
    var block = (App.netId==1)?350000:0;
    var filteroption = {fromBlock: block, toBlock: 'latest'};
    instance.allEvents(filteroption,function(error, eventResult){
      if (error)
        console.log('Error in myEvent event handler: ' + error);
      else{
        var arg = eventResult.args;
        var message = "UNKNOWN";
        if(eventResult.event=="AbortedBySeller"){
          message = "* AbortedBySeller";
        }
        else if(eventResult.event=="AbortedByBroker"){
           message = "* AbortedByBroker";
        }
        else if(eventResult.event=="PurchaseConfirmed"){
          message = "* PurchaseConfirmed : buyer = " + arg.buyer;
        }
        else if(eventResult.event=="ItemReceived"){
          message = "* ItemReceived";
        }
        else if(eventResult.event=="Validated"){
          message = "* Validated";
        }
        else if(eventResult.event=="ItemInfoChanged"){
          var _ether = web3.fromWei(arg.price.toString(), 'ether');
          message = "* ItemInfoChanged. name : '" + arg.name + "' price : " + _ether + " ETH";
        }
        else if(eventResult.event=="SellerChanged"){
          var arg = eventResult.args;
          message = "* SellerChanged. seller : '" + arg.seller;
        }
        else if(eventResult.event=="BrokerChanged"){
          message = "* BrokerChanged. broker : '" + arg.broker;
        }
        else if(eventResult.event=="BrokerFeeChanged"){
          var _ether = web3.fromWei(arg.fee.toString(), 'ether');
          message = "* BrokerFeeChanged. Fee : '" + _ether + " ETH";
        }
        else if(eventResult.event=="IndividualItemReceived"){
          var arg = eventResult.args;
          message = "* IndividualItemReceived : buyer = " + arg.buyer;
        }
        
        addContractEventlog(eventResult.blockNumber, message);
      }
    });
  },

  startFactoryMonitoringEvent: function(){
    //if no error getting blocknumber
    var block = (App.netId==1)?350000:0;
    var filteroption = {fromBlock: block, toBlock: 'latest'};
    var event = factoryInstance.ContractCreated({},filteroption);
    event.watch(function(error, eventResult){
      if (!error)
      {
        var arg = eventResult.args;
        addContractInfoToTable(arg.timestamp, arg.newcontract, "", arg.contract_type);
        resetContractListTableSelectionEvent();
      } else {
        console.log('Error in myEvent event handler: ' + error);
      }
    });
    return;
  },

  initContract: function(address=null) {
    $.getJSON('Broker.json', function(data) {

      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var artifact = data;
      App.contracts.Broker = TruffleContract(artifact);

      // Set the provider for our contract.
      App.contracts.Broker.setProvider(App.web3Provider);

      $("#tableGame1Events > tbody").html("");
      // Use our contract to retieve and mark the adopted pets.
      // return App.markAdopted();
      if(address){
        instance = App.contracts.Broker.at(address);
        console.log("Old Contract Instance address : " + instance.address);
        App.getInfo();
        App.startMonitoringEvent();
      }
      else{
        // This takes some time... need progress bar
        showPleaseWait(true);

        var cntract_type_name = $('#contract_type_name').val();
        if(!cntract_type_name || 0 === cntract_type_name.length)
          cntract_type_name = "Any";

        var brokerrequired = $("#check_requirebroker").is(":checked");
        factoryInstance.createContract(App.isbroker, cntract_type_name, brokerrequired).then(function(value) {
          var returned = value.logs[0].args;
          instance = App.contracts.Broker.at(returned.newcontract);
          console.log("New Contract Instance address : " + instance.address);
          // addContractInfoToTable(returned.timestamp, instance, returned.creator, returned.contract_type);
          // resetContractListTableSelectionEvent();
          showPleaseWait(false);
        }).catch(function(err) {
          // There was an error! Handle it.  
          console.log(err.message);
          showPleaseWait(false);
          return;
        });
      }
    });
  },

  initFactoryContract: function(address) {
    $.getJSON('Factory.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var artifact = data;
      App.contracts.Factory = TruffleContract(artifact);

      // Set the provider for our contract.
      App.contracts.Factory.setProvider(App.web3Provider);

      // Use our contract to retieve and mark the adopted pets.
      // return App.markAdopted();
      if(address){
        factoryInstance = App.contracts.Factory.at(address);
        console.log("Factory Contract Instance address : " + factoryInstance.address);
        App.startFactoryMonitoringEvent();
      }
      else{
        console.log("NULL address");
        return;
      }
    });
  },

  createOrSet: function(name, price, detail) {
    var _wei = web3.toWei(price, 'ether');
    showPleaseWait(true);
    instance.createOrSet(name, _wei, detail)
    .then(function() {
      App.itemprice = _wei;
      console.log("Changed Item info.");
      showPleaseWait(false);
    }).catch(function(err) {
      console.log(err.message);
      showPleaseWait(false);
    });
  },

  setBroker :  function(addr){
    showPleaseWait(true);
    instance.setBroker(addr)
    .then(function() {
      console.log("Changed broker info.");
      showPleaseWait(false);
    }).catch(function(err) {
      console.log(err.message);
      showPleaseWait(false);
    });
  },

  setBrokerFee :  function(fee){
    var _wei = web3.toWei(fee, 'ether');
    showPleaseWait(true);
    instance.setBrokerFee(_wei)
    .then(function() {
      console.log("Changed broker fee");
      showPleaseWait(false);
    }).catch(function(err) {
      console.log(err.message);
      showPleaseWait(false);
    });
  },

  setSeller :  function(addr){
    showPleaseWait(true);
    instance.setSeller(addr)
    .then(function() {
      console.log("Changed seller info");
      showPleaseWait(false);
    }).catch(function(err) {
      console.log(err.message);
      showPleaseWait(false);
    });
  },

  deleteFile : function(idx){
    instance.deleteDocument(idx).then(function(){
      $('#files .files_list li').remove("._idx"+idx);
    });
  },

  getInfo: function(){
    instance.getInfo().then(function(value) {
      disableSellerBuyerBrokerAndItemInfo(false);

      var state = enumStatus[value[0].toNumber()];
      $("#changeinfo span.contractstatus").text(state);
      $("#changeinfo input.name").val(value[1].toString());
      $("#changeinfo input.detail").val(value[3].toString());
      App.itemprice = parseInt(value[2]);
      var _ether = web3.fromWei(value[2].toString(), 'ether');
      $("#changeinfo input.price").val(_ether);
      console.log("developer fee : " + web3.fromWei(value[5].toString(), 'ether'));
      var seller = value[6];
      var broker = value[7];
      var brokerrequired = value[8];

      //update the contract info table row
      var trid = "#"+instance.address;

      td = $(trid + " td.middlemanexists span.value"); 
      td.html(brokerrequired.toString());

      td = $(trid + " td.status span.value"); 
      var link = "";
      if(App.netId==1){
        link = "<a href=\"https://etherscan.io/address/" + instance.address + "\">" + state +"</a>"
      }
      else{
        link = "<a href=\"https://ropsten.etherscan.io/address/" + instance.address + "\">" + state +"</a>"
      }
      td.html(state);
      td = $(trid + " td.name span.value"); 
      td.html(value[1].toString());
      td = $(trid + " td.price span.value"); 
      td.html(_ether);
          

      instance.getBroker().then(function(value){
        var _ether = web3.fromWei(value[1].toString(), 'ether');
        $("#setbrokerinfo input.brokerAddress").val(value[0].toString());
        $("#setbrokerinfo input.brokerFee").val(_ether);
        $("#setsellerinfo input.brokerFee").val(_ether);
      }).catch(function(err) {
        console.log(err.message);
      });

      instance.getSeller().then(function(value){
        $("#setsellerinfo input.sellerAddress").val(value);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  getBuyers: function(){
    showPleaseWait(true);
    instance.getBuyers().then(function(data) {
      showPleaseWait(false);
      console.log(data);
    }).catch(function(err) {
      console.log(err.message);
      showPleaseWait(false);
    });
  },

  getBuyerInfoAt: function(index){
    showPleaseWait(true);
    instance.getBuyerInfoAt(index).then(function(value) {
      showPleaseWait(false);
      console.log("Buyer address : " + value[0] + ", completed : " + value[1] );
    }).catch(function(err) {
      console.log(err.message);
      showPleaseWait(false);
    });
  },

  getBalance: function(){
    showPleaseWait(true);
    instance.getBalance().then(function(data) {
      showPleaseWait(false);
      console.log(data);
    }).catch(function(err) {
      console.log(err.message);
      showPleaseWait(false);
    });
  },

  abort: function(){
    showPleaseWait(true);
    instance.abort().then(function() {
      //
      showPleaseWait(false);
    }).catch(function(err) {
      console.log(err.message);
      showPleaseWait(false);
    });
  },

  abortByBroker: function(){
    showPleaseWait(true);
    instance.abortByBroker().then(function() {
      //
      showPleaseWait(false);
    }).catch(function(err) {
      console.log(err.message);
      showPleaseWait(false);
    });
  },

  joinAsBroker: function(){
    instance.joinAsBroker().then(function() {
      console.log("join As Broker");
    })
    .catch(function(err) {
      if(err){
        console.log(err.message);
      }
    });
  },

  validate: function(){
    showPleaseWait(true);
    instance.validate().then(function() {
      console.log("validate Document");
      showPleaseWait(false);
    })
    .catch(function(err) {
      if(err){
        console.log(err.message);
      }
      showPleaseWait(false);
    });
  },

  confirmReceived: function(){
    showPleaseWait(true);
    instance.confirmReceived().then(function() {
      console.log("item Received");
      showPleaseWait(false);
    })
    .catch(function(err) {
      if(err){
        console.log(err.message);
      }
      showPleaseWait(false);
    });
  },

  confirmReceivedAt: function(index){
    showPleaseWait(true);
    instance.confirmReceivedAt(index).then(function() {
      console.log("confirmReceivedAt " + index);
      showPleaseWait(false);
    })
    .catch(function(err) {
      if(err){
        console.log(err.message);
      }
      showPleaseWait(false);
    });
  },

  confirmPurchase: function(){
    showPleaseWait(true);
    web3.eth.getAccounts(function(error, accounts){
      showPleaseWait(false);
      if (error) {
        console.log(error);
        return
      }
      var _account = accounts[0];
      if(_account!=null){
        /**/
        instance.confirmPurchase.sendTransaction({
          from:_account,
          value:App.itemprice
        })
        .then(function() {
          console.log("confirmPurchase");
        })
        .catch(function(err) {
          if(err){
            console.log(err.message);
          }
        });
        /**/
      }
      else
      {
        $( "#progressbar_bet_number" ).hide();
      }
    });
  }

};


function finishInitialization()
{
  var lang = navigator.language || navigator.userLanguage; 
  if (lang.indexOf('-') !== -1)
    lang = lang.split('-')[0];
  if (lang.indexOf('_') !== -1)
      lang = lang.split('_')[0];
  switch (lang) {
    case "de":
      lang = 'german';
      break
    case "ko":
      lang = 'korean';
      break
    case "ja":
      lang = 'japanese';
      break
    default:
      lang = 'english';
      break;
  }
  updateLanguageTo(lang);

  var div_select_persontype =['#div_the_seller','#div_the_buyer', '#div_the_broker'];
  for(var i=0; i<div_select_persontype.length; i++){
    $(div_select_persontype[i]).hide(); 
  }
  disableSellerBuyerBrokerAndItemInfo(true);
  $('#div_sub_change_item_info').hide();

  $("button[id='item-info-change']").each(function (i, elt) {
      $(elt).click(function (e) {
      $('#modalItemInfo').modal('hide');
    });
  });

  $("#btn_new_contract").click(function() {
    App.initContract(false);
  });

  $("#changeinfo button.set").click(function() {
    var _name = $("#changeinfo input.name").val();
    var _price = parseFloat($("#changeinfo input.price").val());
    var _detail = $("#changeinfo input.detail").val();
    App.createOrSet(_name, _price, _detail);
  });

  $("#setbrokerinfo button.btnSetBroker").click(function() {
    var _addr = $("#setbrokerinfo input.brokerAddress").val();
    App.setBroker(_addr);
  });

  $("#setbrokerinfo button.btnSetBrokerFee").click(function() {
    var _fee = parseFloat($("#setbrokerinfo input.brokerFee").val());
    App.setBrokerFee(_fee);
  });

  $("#setsellerinfo button.btnSetSeller").click(function() {
    var _addr = $("#setsellerinfo input.sellerAddress").val();
    App.setSeller(_addr);
  });

  $("#setsellerinfo button.btnSetBrokerFee").click(function() {
    var _fee = parseFloat($("#setsellerinfo input.brokerFee").val());
    App.setBrokerFee(_fee);
  });

  //QmVF6wiepc3K5E11qznUVsCuf92ce3RE4XHXKPi28zT9po
  $("#seller button.uploadFile").click(function() {
    var input = $("#seller input[type=file]");
    var _purpose = web3.toHex($('#comboPurpose :selected').text());
    var _name = $("#seller input.file_title").val();
    App.addFile(input, _purpose, _name);
  });

  $("#files .files_list").on('click', 'button', function() {
    var idx = $(this).val();
    App.deleteFile(idx);
  });
  
  $("#selleraborts button.abortPurchase").click(function() {
    App.abort();
  });
  
  $("#broker button.join").click(function() {
    App.joinAsBroker();
  });

  $("#brokervalidatedocuments button.validateDocument").click(function() {
    App.validate();
    
  });

  $("#brokerconfirmreceive button.confirmRecieved").click(function() {
    App.confirmReceived();
  });

  $("#brokeraborts button.abortPurchase").click(function() {
    App.abortByBroker();
  });

  $("#buyerconfirmpurchase button.confirmPurchase").click(function() {
    App.confirmPurchase();
  });

  $(':radio').on('change.radiocheck', function(value) {
    var radio_ids = ['radio_seller','radio_buyer','radio_broker'];
    for(var i=0; i<radio_ids.length; i++){
      var show = (radio_ids[i]==value.target.id);
      if(show) {
        $(div_select_persontype[i]).show();
      }
      else{
        $(div_select_persontype[i]).hide(); 
      }
    }
    if(value.target.id!="radio_buyer")
      $('#div_sub_change_item_info').show();
    else
      $('#div_sub_change_item_info').hide();
  });
}


$(document).ready(function() {
  //$('#modalItemInfo').modal('show');
  $('#modalHowto').load('modal_howto.html', function() {
    $('#div_the_seller').load('theseller.html', function() {
      $('#div_the_broker').load('thebroker.html', function() {
        $('#div_the_buyer').load('thebuyer.html', function() {
          $('#tab_faq').load('tab_faq.html', function() {
            $('#tab_contract').load('tab_contract.html', function() {
              $('#tab_terms').load('tab_terms.html', function() {
                // Use following Tool to escape HTML strings for JSON
                // https://www.freeformatter.com/json-escape.html#ad-output
                $.getJSON('language.json', function(data) {
                  $languagedata = data;
                  finishInitialization();
                  $("#check_requirebroker").radiocheck('check');
                  App.init();
                });
              });
            });
          });
        });
      });
    });
  });
});



$(function() {
  $(window).load(function() {
    
  });
});



