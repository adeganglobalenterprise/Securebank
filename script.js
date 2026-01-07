// Banking App - Complete JavaScript

// Global State
let currentUser = null;
let balances = {
    main: { USD: 0, EUR: 0, GBP: 0, NGN: 0, CNY: 0 },
    crypto: { BTC: 0, ETH: 0, TRX: 0, TON: 0, USDT: 0 },
    wallet: 0
};

let transactions = [];
let miningState = {
    currencies: {
        USD: { active: false, progress: 0, timer: 3600, mined: 0 },
        EUR: { active: false, progress: 0, timer: 3600, mined: 0 },
        GBP: { active: false, progress: 0, timer: 3600, mined: 0 },
        CNY: { active: false, progress: 0, timer: 3600, mined: 0 },
        NGN: { active: false, progress: 0, timer: 3600, mined: 0 }
    },
    crypto: {
        BTC: { active: false, progress: 0, timer: 3600, mined: 0 },
        ETH: { active: false, progress: 0, timer: 3600, mined: 0 },
        TRX: { active: false, progress: 0, timer: 3600, mined: 0 },
        TON: { active: false, progress: 0, timer: 3600, mined: 0 }
    }
};

let walletAddresses = {
    fiat: { credit: '', debit: '' },
    crypto: { BTC: '', ETH: '', TRX: '', TON: '' }
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load saved data
    loadUserData();
    
    // Generate initial wallet addresses
    generateWalletAddress('fiat');
    generateBlockchainAddress();
    
    // Update displays
    updateBalances();
    updateTransactions();
    
    // Setup event listeners
    setupEventListeners();
    
    // Show user login modal
    document.getElementById('userLoginModal').style.display = 'block';
}

// Setup Event Listeners
function setupEventListeners() {
    // Modal close buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Admin Login
    document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);

    // User Login
    document.getElementById('userLoginForm').addEventListener('submit', handleUserLogin);

    // Registration
    document.getElementById('registerForm').addEventListener('submit', handleRegistration);

    // Credit Form
    document.getElementById('creditForm').addEventListener('submit', handleCredit);

    // Debit Form
    document.getElementById('debitForm').addEventListener('submit', handleDebit);

    // Local Transfer
    document.getElementById('localTransferForm').addEventListener('submit', handleLocalTransfer);

    // International Transfer
    document.getElementById('internationalTransferForm').addEventListener('submit', handleInternationalTransfer);

    // Crypto Transfer
    document.getElementById('cryptoTransferForm').addEventListener('submit', handleCryptoTransfer);

    // Microfinance Transfer
    document.getElementById('microfinanceTransferForm').addEventListener('submit', handleMicrofinanceTransfer);

    // Profile Form
    document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);

    // Edit Balance Form
    document.getElementById('editBalanceForm').addEventListener('submit', handleBalanceEdit);

    // Photo Upload
    document.getElementById('photoInput').addEventListener('change', handlePhotoUpload);
}

// Modal Functions
function showAdminLogin() {
    document.getElementById('adminLoginModal').style.display = 'block';
}

function showRegister() {
    document.getElementById('userLoginModal').style.display = 'none';
    document.getElementById('registerModal').style.display = 'block';
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    event.target.classList.add('active');
}

// Authentication
function handleAdminLogin(e) {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    // Simple admin authentication (in real app, use proper backend)
    if (username === 'admin' && password === 'admin123') {
        showToast('Admin login successful!');
        document.getElementById('adminLoginModal').style.display = 'none';
        // Grant admin privileges
        localStorage.setItem('isAdmin', 'true');
    } else {
        showToast('Invalid admin credentials!');
    }
}

function handleUserLogin(e) {
    e.preventDefault();
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;

    // Simple user authentication (in real app, use proper backend)
    const savedUser = localStorage.getItem('user_' + email);
    if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user.password === password) {
            currentUser = user;
            loadUserProfile();
            showToast('Welcome back, ' + user.name + '!');
            document.getElementById('userLoginModal').style.display = 'none';
        } else {
            showToast('Invalid password!');
        }
    } else {
        showToast('User not found. Please register.');
    }
}

function handleRegistration(e) {
    e.preventDefault();
    const user = {
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPassword').value,
        phone: document.getElementById('regPhone').value,
        country: document.getElementById('regCountry').value,
        createdAt: new Date().toISOString()
    };

    localStorage.setItem('user_' + user.email, JSON.stringify(user));
    showToast('Registration successful! Please login.');
    document.getElementById('registerModal').style.display = 'none';
    document.getElementById('userLoginModal').style.display = 'block';
}

function logout() {
    currentUser = null;
    showToast('Logged out successfully!');
    document.getElementById('userLoginModal').style.display = 'block';
}

// Profile Management
function loadUserProfile() {
    if (currentUser) {
        document.getElementById('profileName').value = currentUser.name || '';
        document.getElementById('profileEmail').value = currentUser.email || '';
        document.getElementById('profilePhone').value = currentUser.phone || '';
        document.getElementById('profileCountry').value = currentUser.country || '';
        document.getElementById('profileDOB').value = currentUser.dob || '';
        document.getElementById('profileSex').value = currentUser.sex || '';
        document.getElementById('profileAddress').value = currentUser.address || '';
    }
}

function handleProfileUpdate(e) {
    e.preventDefault();
    if (currentUser) {
        currentUser.name = document.getElementById('profileName').value;
        currentUser.email = document.getElementById('profileEmail').value;
        currentUser.phone = document.getElementById('profilePhone').value;
        currentUser.country = document.getElementById('profileCountry').value;
        currentUser.dob = document.getElementById('profileDOB').value;
        currentUser.sex = document.getElementById('profileSex').value;
        currentUser.address = document.getElementById('profileAddress').value;

        localStorage.setItem('user_' + currentUser.email, JSON.stringify(currentUser));
        showToast('Profile updated successfully!');
    }
}

function uploadPhoto() {
    document.getElementById('photoInput').click();
}

function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const photoDiv = document.getElementById('profilePhoto');
            photoDiv.innerHTML = `<img src="${event.target.result}" alt="Profile Photo">`;
            if (currentUser) {
                currentUser.photo = event.target.result;
                localStorage.setItem('user_' + currentUser.email, JSON.stringify(currentUser));
            }
        };
        reader.readAsDataURL(file);
        showToast('Photo uploaded successfully!');
    }
}

// Balance Management
function updateBalances() {
    const currency = document.getElementById('mainCurrency').value;
    const currencySymbols = {
        USD: '$', EUR: '€', GBP: '£', NGN: '₦', CNY: '¥'
    };
    
    document.getElementById('mainBalance').textContent = 
        currencySymbols[currency] + balances.main[currency].toFixed(2);
    
    document.getElementById('cryptoBalance').textContent = 
        balances.crypto.BTC.toFixed(8) + ' BTC';
    
    document.getElementById('walletBalance').textContent = 
        '$' + balances.wallet.toFixed(2);
}

function updateMainCurrency() {
    updateBalances();
}

function editBalance(type) {
    const modal = document.getElementById('editBalanceModal');
    const form = document.getElementById('editBalanceForm');
    const typeInput = document.getElementById('editBalanceType');
    const currentDisplay = document.getElementById('currentBalanceDisplay');
    const newBalanceInput = document.getElementById('newBalance');

    typeInput.value = type;

    if (type === 'main') {
        const currency = document.getElementById('mainCurrency').value;
        currentDisplay.value = balances.main[currency].toFixed(2);
    } else if (type === 'crypto') {
        currentDisplay.value = balances.crypto.BTC.toFixed(8);
    } else if (type === 'wallet') {
        currentDisplay.value = balances.wallet.toFixed(2);
    }

    modal.style.display = 'block';
    newBalanceInput.value = '';
    newBalanceInput.focus();
}

function handleBalanceEdit(e) {
    e.preventDefault();
    const type = document.getElementById('editBalanceType').value;
    const newBalance = parseFloat(document.getElementById('newBalance').value);

    if (type === 'main') {
        const currency = document.getElementById('mainCurrency').value;
        balances.main[currency] = newBalance;
    } else if (type === 'crypto') {
        balances.crypto.BTC = newBalance;
    } else if (type === 'wallet') {
        balances.wallet = newBalance;
    }

    updateBalances();
    saveUserData();
    document.getElementById('editBalanceModal').style.display = 'none';
    showToast('Balance updated successfully!');
}

// Credit/Debit Management
function handleCredit(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('creditAmount').value);
    const currency = document.getElementById('creditCurrency').value;
    const description = document.getElementById('creditDescription').value;

    balances.main[currency] += amount;
    
    addTransaction({
        type: 'credit',
        amount: amount,
        currency: currency,
        description: description || 'Credit added',
        date: new Date().toISOString()
    });

    document.getElementById('creditAmount').value = '';
    document.getElementById('creditDescription').value = '';
    
    updateBalances();
    updateTransactions();
    saveUserData();
    sendAlerts('credit', amount, currency, description);
    showToast('Credit of ' + amount + ' ' + currency + ' added successfully!');
}

function handleDebit(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('debitAmount').value);
    const currency = document.getElementById('debitCurrency').value;
    const description = document.getElementById('debitDescription').value;

    balances.main[currency] -= amount;
    
    addTransaction({
        type: 'debit',
        amount: amount,
        currency: currency,
        description: description || 'Debit added',
        date: new Date().toISOString()
    });

    document.getElementById('debitAmount').value = '';
    document.getElementById('debitDescription').value = '';
    
    updateBalances();
    updateTransactions();
    saveUserData();
    sendAlerts('debit', amount, currency, description);
    showToast('Debit of ' + amount + ' ' + currency + ' processed successfully!');
}

// Transaction Management
function addTransaction(transaction) {
    transactions.unshift(transaction);
    if (transactions.length > 50) {
        transactions.pop();
    }
}

function updateTransactions() {
    const container = document.getElementById('transactionsList');
    
    if (transactions.length === 0) {
        container.innerHTML = `
            <div class="no-transactions">
                <i class="fas fa-receipt"></i>
                <p>No transactions yet</p>
            </div>
        `;
        return;
    }

    container.innerHTML = transactions.map(tx => {
        const isCredit = tx.type === 'credit';
        const currencySymbols = {
            USD: '$', EUR: '€', GBP: '£', NGN: '₦', CNY: '¥'
        };
        const symbol = currencySymbols[tx.currency] || '$';
        const date = new Date(tx.date).toLocaleDateString();
        
        return `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-icon ${tx.type}">
                        <i class="fas fa-${isCredit ? 'arrow-down' : 'arrow-up'}"></i>
                    </div>
                    <div class="transaction-details">
                        <h4>${tx.description}</h4>
                        <p>${date}</p>
                    </div>
                </div>
                <div class="transaction-amount ${tx.type}">
                    ${isCredit ? '+' : '-'}${symbol}${tx.amount.toFixed(2)}
                </div>
            </div>
        `;
    }).join('');
}

function editTransactions() {
    if (localStorage.getItem('isAdmin') === 'true') {
        const action = prompt('Enter action (add/remove):');
        if (action === 'add') {
            const amount = prompt('Enter amount:');
            const type = prompt('Enter type (credit/debit):');
            const description = prompt('Enter description:');
            
            if (amount && type && description) {
                addTransaction({
                    type: type,
                    amount: parseFloat(amount),
                    currency: 'USD',
                    description: description,
                    date: new Date().toISOString()
                });
                updateTransactions();
                saveUserData();
                showToast('Transaction added!');
            }
        } else if (action === 'remove') {
            transactions.shift();
            updateTransactions();
            saveUserData();
            showToast('Last transaction removed!');
        }
    } else {
        showToast('Admin access required!');
    }
}

// Transfer Functions
function showTransferTab(tabId) {
    document.querySelectorAll('.transfer-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabId + 'Transfer').classList.add('active');
    event.target.classList.add('active');
}

function handleLocalTransfer(e) {
    e.preventDefault();
    const bank = document.getElementById('localBank').value;
    const accountNumber = document.getElementById('localAccountNumber').value;
    const accountName = document.getElementById('localAccountName').value;
    const amount = parseFloat(document.getElementById('localAmount').value);
    const description = document.getElementById('localDescription').value;
    const sendSMS = document.getElementById('localSMS').checked;
    const sendEmail = document.getElementById('localEmail').checked;

    // Check balance
    if (amount > balances.main.USD) {
        showToast('Insufficient balance!');
        return;
    }

    // Process transfer
    balances.main.USD -= amount;
    
    addTransaction({
        type: 'debit',
        amount: amount,
        currency: 'USD',
        description: `Transfer to ${accountName} (${bank}) - ${description}`,
        date: new Date().toISOString()
    });

    // Send alerts if requested
    if (sendSMS || sendEmail) {
        sendTransactionAlerts('local', {
            bank, accountNumber, accountName, amount, description
        }, sendSMS, sendEmail);
    }

    // Reset form
    document.getElementById('localTransferForm').reset();
    
    updateBalances();
    updateTransactions();
    saveUserData();
    showToast(`$${amount} transferred to ${accountName} successfully!`);
}

function handleInternationalTransfer(e) {
    e.preventDefault();
    const country = document.getElementById('internationalCountry').value;
    const bank = document.getElementById('internationalBank').value;
    const swiftCode = document.getElementById('swiftCode').value;
    const swissCode = document.getElementById('swissCode').value;
    const account = document.getElementById('internationalAccount').value;
    const name = document.getElementById('internationalName').value;
    const amount = parseFloat(document.getElementById('internationalAmount').value);
    const purpose = document.getElementById('internationalPurpose').value;

    // Determine currency based on country
    const currencyMap = {
        'US': 'USD', 'UK': 'GBP', 'EU': 'EUR', 'CH': 'CNY', 'CN': 'CNY'
    };
    const currency = currencyMap[country] || 'USD';

    // Check balance
    if (amount > balances.main[currency]) {
        showToast('Insufficient balance!');
        return;
    }

    // Process transfer
    balances.main[currency] -= amount;
    
    addTransaction({
        type: 'debit',
        amount: amount,
        currency: currency,
        description: `International transfer to ${name} (${bank}, ${country}) - SWIFT: ${swiftCode}`,
        date: new Date().toISOString()
    });

    sendTransactionAlerts('international', {
        country, bank, swiftCode, swissCode, account, name, amount, purpose
    }, true, true);

    document.getElementById('internationalTransferForm').reset();
    
    updateBalances();
    updateTransactions();
    saveUserData();
    showToast(`International transfer of ${amount} ${currency} to ${name} initiated!`);
}

function handleCryptoTransfer(e) {
    e.preventDefault();
    const cryptoType = document.getElementById('cryptoType').value;
    const walletAddress = document.getElementById('cryptoWalletAddress').value;
    const amount = parseFloat(document.getElementById('cryptoAmount').value);

    // Check balance
    if (amount > balances.crypto[cryptoType]) {
        showToast(`Insufficient ${cryptoType} balance!`);
        return;
    }

    // Process transfer
    balances.crypto[cryptoType] -= amount;
    
    addTransaction({
        type: 'debit',
        amount: amount,
        currency: cryptoType,
        description: `Crypto transfer to wallet ${walletAddress.substring(0, 10)}...`,
        date: new Date().toISOString()
    });

    sendTransactionAlerts('crypto', {
        cryptoType, walletAddress, amount
    }, true, true);

    document.getElementById('cryptoTransferForm').reset();
    
    updateBalances();
    updateTransactions();
    saveUserData();
    showToast(`${amount} ${cryptoType} transferred successfully!`);
}

function handleMicrofinanceTransfer(e) {
    e.preventDefault();
    const platform = document.getElementById('microfinancePlatform').value;
    const account = document.getElementById('microfinanceAccount').value;
    const name = document.getElementById('microfinanceName').value;
    const amount = parseFloat(document.getElementById('microfinanceAmount').value);

    // Check balance
    if (amount > balances.main.NGN) {
        showToast('Insufficient NGN balance!');
        return;
    }

    // Process transfer
    balances.main.NGN -= amount;
    
    const platformNames = {
        'palmpay': 'PalmPay', 'moniepoint': 'Moniepoint', 'opay': 'OPay'
    };
    
    addTransaction({
        type: 'debit',
        amount: amount,
        currency: 'NGN',
        description: `Microfinance transfer via ${platformNames[platform]} to ${name}`,
        date: new Date().toISOString()
    });

    sendTransactionAlerts('microfinance', {
        platform, account, name, amount
    }, true, true);

    document.getElementById('microfinanceTransferForm').reset();
    
    updateBalances();
    updateTransactions();
    saveUserData();
    showToast(`₦${amount} transferred via ${platformNames[platform]} successfully!`);
}

// Alert System
function sendAlerts(type, amount, currency, description) {
    const smsEnabled = document.getElementById('smsAlerts')?.checked || false;
    const emailEnabled = document.getElementById('emailAlerts')?.checked || false;

    if (smsEnabled || emailEnabled) {
        console.log(`Sending ${type} alert: ${amount} ${currency} - ${description}`);
        // In real app, this would call SMS/email API
    }
}

function sendTransactionAlerts(transferType, details, sendSMS, sendEmail) {
    if (sendSMS) {
        console.log(`SMS Alert: ${transferType} transfer processed`);
        // Simulate SMS sending
        showToast('SMS alert sent!');
    }
    
    if (sendEmail) {
        console.log(`Email Alert: ${transferType} transfer processed`);
        // Simulate email sending
        showToast('Email alert sent!');
    }
}

// Wallet Management
function generateWalletAddress(type) {
    if (type === 'fiat') {
        walletAddresses.fiat.credit = generateRandomAddress(40);
        walletAddresses.fiat.debit = generateRandomAddress(40);
        
        document.getElementById('fiatCreditAddress').value = walletAddresses.fiat.credit;
        document.getElementById('fiatDebitAddress').value = walletAddresses.fiat.debit;
        document.getElementById('displayWalletAddr').textContent = 
            walletAddresses.fiat.credit.substring(0, 20) + '...';
        
        saveUserData();
        showToast('New fiat wallet addresses generated!');
    }
}

function generateBlockchainAddress() {
    walletAddresses.crypto.BTC = generateRandomAddress(34);
    walletAddresses.crypto.ETH = generateRandomAddress(42);
    walletAddresses.crypto.TRX = generateRandomAddress(34);
    walletAddresses.crypto.TON = generateRandomAddress(48);

    document.getElementById('btcAddress').value = walletAddresses.crypto.BTC;
    document.getElementById('ethAddress').value = walletAddresses.crypto.ETH;
    document.getElementById('trxAddress').value = walletAddresses.crypto.TRX;
    document.getElementById('tonAddress').value = walletAddresses.crypto.TON;

    saveUserData();
    showToast('New blockchain addresses generated!');
}

function generateRandomAddress(length) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let address = '';
    for (let i = 0; i < length; i++) {
        address += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return address;
}

function copyAddress(elementId) {
    const address = document.getElementById(elementId).value;
    navigator.clipboard.writeText(address).then(() => {
        showToast('Address copied to clipboard!');
    });
}

// GitHub Integration
function connectGitHub() {
    const githubUsername = prompt('Enter your GitHub username:');
    if (githubUsername) {
        const statusDiv = document.getElementById('githubStatus');
        statusDiv.innerHTML = `
            <div class="github-status connected">
                <i class="fas fa-check-circle"></i>
                <span>Connected to: @${githubUsername}</span>
            </div>
        `;
        showToast('GitHub connected successfully!');
    }
}

// Receive Payment
function receivePayment() {
    document.getElementById('receivePaymentModal').style.display = 'block';
    document.getElementById('receiveWalletAddress').value = walletAddresses.fiat.credit;
}

function shareAddress() {
    const address = document.getElementById('receiveWalletAddress').value;
    if (navigator.share) {
        navigator.share({
            title: 'My Wallet Address',
            text: `Send payment to: ${address}`
        });
    } else {
        copyAddress('receiveWalletAddress');
    }
}

// Mining System
function startAllMining() {
    // Start currency mining
    Object.keys(miningState.currencies).forEach(currency => {
        startMining('currency', currency);
    });

    // Start crypto mining
    Object.keys(miningState.crypto).forEach(crypto => {
        startMining('crypto', crypto);
    });

    showToast('All mining operations started!');
}

function startMining(type, asset) {
    if (type === 'currency') {
        miningState.currencies[asset].active = true;
        miningState.currencies[asset].progress = 0;
        miningState.currencies[asset].timer = 3600; // 1 hour in seconds
        updateMiningUI('currency', asset);
    } else {
        miningState.crypto[asset].active = true;
        miningState.crypto[asset].progress = 0;
        miningState.crypto[asset].timer = 3600;
        updateMiningUI('crypto', asset);
    }
}

function pauseAllMining() {
    Object.keys(miningState.currencies).forEach(currency => {
        miningState.currencies[currency].active = false;
        updateMiningUI('currency', currency);
    });

    Object.keys(miningState.crypto).forEach(crypto => {
        miningState.crypto[crypto].active = false;
        updateMiningUI('crypto', crypto);
    });

    showToast('All mining operations paused!');
}

function resetMining() {
    Object.keys(miningState.currencies).forEach(currency => {
        miningState.currencies[currency] = {
            active: false,
            progress: 0,
            timer: 3600,
            mined: 0
        };
        updateMiningUI('currency', currency);
        document.getElementById(currency.toLowerCase() + 'Mined').textContent = '0 ' + currency;
    });

    Object.keys(miningState.crypto).forEach(crypto => {
        miningState.crypto[crypto] = {
            active: false,
            progress: 0,
            timer: 3600,
            mined: 0
        };
        updateMiningUI('crypto', crypto);
        document.getElementById(crypto.toLowerCase() + 'Mined').textContent = '0 ' + crypto;
    });

    showToast('Mining operations reset!');
}

function updateMiningUI(type, asset) {
    if (type === 'currency') {
        const state = miningState.currencies[asset];
        const statusElement = document.getElementById(asset.toLowerCase() + 'MiningStatus');
        const progressElement = document.getElementById(asset.toLowerCase() + 'Progress');
        const timerElement = document.getElementById(asset.toLowerCase() + 'Timer');

        if (statusElement) {
            statusElement.innerHTML = `
                <span class="status-indicator ${state.active ? 'active' : ''}"></span>
                <span>${state.active ? 'Active' : 'Paused'}</span>
            `;
        }

        if (progressElement) {
            progressElement.style.width = state.progress + '%';
        }

        if (timerElement) {
            timerElement.textContent = formatTime(state.timer);
        }
    } else {
        const state = miningState.crypto[asset];
        const statusElement = document.getElementById(asset.toLowerCase() + 'MiningStatus');
        const progressElement = document.getElementById(asset.toLowerCase() + 'Progress');
        const timerElement = document.getElementById(asset.toLowerCase() + 'Timer');

        if (statusElement) {
            statusElement.innerHTML = `
                <span class="status-indicator ${state.active ? 'active' : ''}"></span>
                <span>${state.active ? 'Active' : 'Paused'}</span>
            `;
        }

        if (progressElement) {
            progressElement.style.width = state.progress + '%';
        }

        if (timerElement) {
            timerElement.textContent = formatTime(state.timer);
        }
    }
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Mining Loop - Runs every second
setInterval(() => {
    // Process currency mining
    Object.keys(miningState.currencies).forEach(currency => {
        const state = miningState.currencies[currency];
        if (state.active && state.timer > 0) {
            state.timer--;
            state.progress = ((3600 - state.timer) / 3600) * 100;
            updateMiningUI('currency', currency);

            if (state.timer === 0) {
                // Mining complete - add 1000 of the currency
                balances.main[currency] += 1000;
                state.mined += 1000;
                
                // Add to wallet balance (convert to USD equivalent)
                const conversionRates = { USD: 1, EUR: 1.1, GBP: 1.3, NGN: 0.0015, CNY: 0.14 };
                balances.wallet += 1000 * conversionRates[currency];
                
                // Reset and start again
                state.timer = 3600;
                state.progress = 0;
                
                document.getElementById(currency.toLowerCase() + 'Mined').textContent = 
                    state.mined + ' ' + currency;
                
                updateBalances();
                saveUserData();
                
                if (currency === 'USD') {
                    showToast('1000 USD mined and added to balance!');
                }
            }
        }
    });

    // Process crypto mining
    Object.keys(miningState.crypto).forEach(crypto => {
        const state = miningState.crypto[crypto];
        if (state.active && state.timer > 0) {
            state.timer--;
            state.progress = ((3600 - state.timer) / 3600) * 100;
            updateMiningUI('crypto', crypto);

            if (state.timer === 0) {
                // Mining complete
                let minedAmount = 0;
                
                if (crypto === 'BTC') {
                    minedAmount = 1; // 1 BTC per hour
                } else if (crypto === 'ETH') {
                    minedAmount = 0.5;
                } else if (crypto === 'TRX') {
                    minedAmount = 1000;
                } else if (crypto === 'TON') {
                    minedAmount = 100;
                }

                balances.crypto[crypto] += minedAmount;
                state.mined += minedAmount;
                
                // Reset and start again
                state.timer = 3600;
                state.progress = 0;
                
                document.getElementById(crypto.toLowerCase() + 'Mined').textContent = 
                    state.mined + ' ' + crypto;
                
                updateBalances();
                saveUserData();
                
                if (crypto === 'BTC') {
                    showToast('1 BTC mined and added to balance!');
                }
            }
        }
    });
}, 1000);

// Settings
function saveSettings() {
    const settings = {
        smsAlerts: document.getElementById('smsAlerts').checked,
        emailAlerts: document.getElementById('emailAlerts').checked,
        pushAlerts: document.getElementById('pushAlerts').checked,
        twoFactor: document.getElementById('twoFactor').checked,
        loginAlerts: document.getElementById('loginAlerts').checked,
        displayCurrency: document.getElementById('displayCurrency').value,
        language: document.getElementById('language').value
    };

    localStorage.setItem('settings', JSON.stringify(settings));
    showToast('Settings saved successfully!');
}

function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        if (currentUser) {
            localStorage.removeItem('user_' + currentUser.email);
            logout();
            showToast('Account deleted successfully!');
        }
    }
}

// Data Persistence
function saveUserData() {
    const data = {
        balances: balances,
        transactions: transactions,
        walletAddresses: walletAddresses,
        miningState: miningState
    };
    localStorage.setItem('bankingAppData', JSON.stringify(data));
}

function loadUserData() {
    const savedData = localStorage.getItem('bankingAppData');
    if (savedData) {
        const data = JSON.parse(savedData);
        balances = data.balances || balances;
        transactions = data.transactions || [];
        walletAddresses = data.walletAddresses || walletAddresses;
        miningState = data.miningState || miningState;
    }
}

// Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show';
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

// Auto-start mining after page load
setTimeout(() => {
    startAllMining();
}, 2000);