# The Broker

(Also migrated to the test network, 'Ropsten')

Ethereum Smart Contract assure us the transaction between both parties involved in a contract is authentic. But do you really trust anybody on the Internet? What if the seller doesn't send you the product after you paid the price already? What if the buyer doesn't confirm or even pretend he/she didn't get the product?

That's why we have a person in the middle of the contract who checks the product, document, money transfer, product delivery, and do other validation stuffs. We call them, the Broker. The same thing can happen in the Smart Contract.

Any deal you want protection of 3rd person on your deal, please use this service.

## 3 parties

In this Smart Contract, we have 3 paries invloved. The seller, they buyer, and the broker. Let's think about their roles in case the seller wants to sell a house.

### the Seller
The Seller is the owner of the house. The Seller decides the price of the house, can select the Broker, and set the fee for the Broker. The Seller can 'abort' the contract only at the 'created' stage. 

### the Broker
The Broker is the validator, and the witness of the contract. In the earlier stage of selling a house, the broker can check all the documents the seller or buyer give in (the history of the house, insurance information, inspection report, etc). At the end of the contract, the buyer sends the money and once all paper process is done (the Buyer is now officially the owner of the house), the broker confirms it. Only after that, the money is sent to the seller, and the given fee is sent to the broker.

Only the broker can cancel the contract if there's any fraud found or any of the seller/buyer don't want to continue. If the contract is canceled after the buyer sent the money, the money is safely returned back to the buyer.

### the Buyer
The buyer sends the money, give in required documents to the broker for validation.


Either the seller or broker can create a new contract. Only the creator can set the price information, and the fee for the broker. 

When selling a house, usally the realtor will do the broker's role so the realtor will create the contract from hise/her PC, set the seller information (Etherum address) and the fee the broker will take from the price. Or a seller can create a new contract, asking somebody else like lawyer do the broker's role. The seller can set the information of the person doing the broker's role, his Ethereum address fee and the fee to that person.

## States of the contract

### Created
A new contract is created either by a seller or broker. They can set the price and the fee information. (Seller an Broker can abort the contract)

### Validated
If the broker checked all the documents or the status of the product, the broker can 'validate'. Since this status no one can change the product information (price). (Only the Broker can abort the contract)

### Locked
Once a buyer sends the money to this contract, the contract is Locked. The Seller should deliever the product to the buyer.
(Only the Broker can abort the contract) If the product is not delivered, the broker should abort the contract. And the broker should be careful when dicide whether to abort or not.

### Inactive
The broker needs to check if the product is delievered to the buyer. If the deal is done, the broker confirms and the contract goes to 'Inactive' status. Which means all is done for this contract, nothing to do with this anymore. Also, if the contract is aborted by the broker, the contract goes to 'Inactive' status.


## Live
It's on the Swarm
http://swarm-gateways.net/bzz://thebroker.eth/index.html
Use Mist Browser or Chrom with MetaMask plug-in installed.

## For example, when you sell your house

### If you are registered Realtor

Meet with the seller, check the documents required, and visit the Live site above and create a new contract.
Sit togather with the seller, you set seller's Ethereum addres, price of the house, and the fee you want to take from the deal.

Now you meet with buysers, introduce them the house and tell them a price, and if a buyer is decided, ask the buyer the documents you want to verify.

And if all documents or hous status is fine, press 'Validate the documents' button.

Now the buyer can visit the live site, you share the buyer the contract address, and the buyer set the contract addres and just press 'Confirm purchase' button. In this stage, no money is sent to anyone.

Now you transfer all rights to the buyer. Once the buyer finally get the house key and all procedure is done, visit the live site, set the contract address, and press 'Confirm transfer of item' button. Now the money is sent to the Seller, you and the developer. Developer will get Minimum 0.1 Finney (0.0001 eth ~ 25Cent) to 0.01% of the price (only if the deal was successful, just like the seller and the broker).

### If you are the Seller

Look for a realtor you can trust, or somebody neutral to both of you and the buyer for validation of the process.

Set the realtor (or the other 3rd party)'s Etherum address, price of your house, and the fee you want to give. (Or even you claim yourself as a broker and make a deal between only you and the buyer, but this breaks the goal we want to achieve with this service)

Find the buyer.

Let the realtor to validate the document as described above, and share the contract the address to the buyer.

Now the buyer visit the live site, press the 'confirm purchase', and once the relator press the 'confirm transfer of item', the money will be depositted to your account.


## For example, when you sell your car

This is same. The broker can be the car dealer. The dealer checks the status of the car, check if the car is actually delivered to the buyer. If everything seems fine, press the 'confirm transfer of item'.


## If you are the online shopping mall,
Please change the HTML and Javascript here, and adjust to your service to automate the process.
Important thing is that you have responsibility of making sure of the item delivery.


## Future plan
Of course, we can mix in the 'auction' model here.


