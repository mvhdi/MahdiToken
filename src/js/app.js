
// App object
App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    loading: false,
    // token price is .001 eth
    tokenPrice:1000000000000000,
    tokensSold: 0,
    tokensAvailable:75000,



    init: function(){
        console.log("App initalized")
        return App.initWeb3();
    },

// initalize web3 to get the font-end client to talk with the Eth blockchain using meta mask that turns it into a blockchain browser
    initWeb3: function() {
        if (typeof web3 !== 'undefined') {
            // if a web3 instance is already provided by Meta Mask.
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } 
        else {
            // else set to defualt provider
            // HTTP://127.0.0.1:7545 is the RPC SERVER on my Ganache application
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }
        return App.initContracts();

    },

    //initalize our smart contract 
    initContracts: function() {
        // load the token sale contract
        $.getJSON("MahdiTokenSale.json", function(mahdiTokenSale){
            // console.log(mahdiTokenSale);
            // truffleContract reads our smart contract
            // MahdiTokenSale is defined in our migrations folder
            App.contracts.MahdiTokenSale = TruffleContract(mahdiTokenSale);
            App.contracts.MahdiTokenSale.setProvider(App.web3Provider);
            App.contracts.MahdiTokenSale.deployed().then(function(mahdiTokenSale) {
                console.log("Mahdi Token Sale Address: ", mahdiTokenSale.address);
            });
        }).done(function() {
            // load the token
            $.getJSON("MahdiToken.json", function(mahdiToken) {
                App.contracts.MahdiToken = TruffleContract(mahdiToken);
                App.contracts.MahdiToken.setProvider(App.web3Provider);
                App.contracts.MahdiToken.deployed().then(function(mahdiToken) {
                    console.log("Mahdi Token Address: ", mahdiToken.address);
                });
                return App.render(); 
            });
        })
    },

    // connect client side with blockchain
    render: function(){
        // prevent rendering while loading
        if(App.loading){
            return;

        }
        App.loading = true;
        var loader =$('#loader');
        var content = $('#content');
        loader.show();
        content.hide();
        //access  account and load account data
        web3.eth.getCoinbase(function(err,account) {
            if(err === null){
                App.account = account;
                $('#accountAddress').html("Your Acccount: " + account);
            }
        })
        // Load token sale contract 
        App.contracts.MahdiTokenSale.deployed().then(function(instance) {
            mahdiTokenSaleInstance = instance;
            // get the price
            return mahdiTokenSaleInstance.tokenPrice();
        }).then(function(tokenPrice) {
            App.tokenPrice = tokenPrice;
            // show the price converted from wei
            $('.token-price').html(web3.fromWei(tokenPrice,"ether").toNumber());
            // tokens sold
            return mahdiTokenSaleInstance.tokensSold();
        }).then(function(tokensSold) {
            App.tokensSold = tokensSold.toNumber();
            // distplay tokens sold
            $('.tokens-sold').html(App.tokensSold);
            $('.tokens-available').html(App.tokensAvailable)

            //progress loader
            var progressPercent =(Math.ceil(App.tokensSold / App.tokensAvailable))*100;
            $('#progress').css('width', progressPercent +'%');


            // Load the token contract
            App.contracts.MahdiToken.deployed().then(function(instance) {
                mahdiTokenInstance = instance;
                return mahdiTokenInstance.balanceOf(App.account);
            }).then(function(balance) {
                $('.mahdToken-balance').html(balance.toNumber());

                // show after loading data
                App.loading = false;
                loader.hide();
                content.show();
            })

        });
        
    },
    
    // buy tokens 
    buyTokens: function() {
        $('#content').hide();
        $('#loader').show();
        var numberOfTokens = $('#numberOfTokens').val();
        App.contracts.MahdiTokenSale.deployed().then(function(instance) {
            return instance.buyTokens(numberOfTokens, {
                from: App.account,
                value: numberOfTokens *App.tokenPrice,
                gas: 500000
            });
        }).then(function(result) {
            console.log("Tokens bought...");
            $('form').trigger('reset') ;// reset number of tokens in form
            $('#loader').hide();
            $('#content').show();
        });
    } 
},



// inital our app when the window loads
$(function(){
    $(window).load(function() {
        App.init();
    }) 
});











// meta mask requries token contracts to ask for permission before 
window.addEventListener('load', async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */});
        } catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
});