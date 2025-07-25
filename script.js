// Biến toàn cục
let cart = [];
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1397623620049572012/UB7R06-vCsbpvcN2p-zztvftzOwh2wHMsyWtQxojDMtq5bfiJ3hfc0VtXrW-tK0WYROF';

// Hàm chuyển đổi tab
function showTab(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName)?.classList.add('active');
    event?.target?.classList.add('active');
    
    if (!event?.target?.classList.contains('tab-btn')) {
        const targetBtn = Array.from(tabButtons).find(btn => 
            btn.getAttribute('onclick')?.includes(tabName)
        );
        targetBtn?.classList.add('active');
    }
}

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart() {
    const product = {
        id: 1,
        name: 'Tài liệu học tập vào 10',
        price: 30000,
        quantity: 1
    };
    
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(product);
    }
    
    updateCartDisplay();
    updateCartCount();
    showNotification('Khá Bành approve! Add sản phẩm như pro! 🕺');
    setTimeout(() => showTabProgrammatically('cart'), 1000);
}

// Hàm hiển thị tab bằng code
function showTabProgrammatically(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName)?.classList.add('active');
    
    const targetBtn = Array.from(tabButtons).find(btn => 
        btn.getAttribute('onclick')?.includes(tabName)
    );
    targetBtn?.classList.add('active');
}

// Hàm cập nhật hiển thị giỏ hàng
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItemsContainer) {
        console.error('cartItems not found');
        return;
    }
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Giỏ hàng trống - Khá Bành buồn lắm! 😅</p>
            </div>
        `;
        cartTotal.style.display = 'none';
    } else {
        let cartHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            cartHTML += `
                <div class="cart-item">
                    <div>
                        <h4>${item.name}</h4>
                        <p>Giá: ${formatPrice(item.price)}</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <button onclick="decreaseQuantity(${index})" style="background: #ff4757; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">-</button>
                            <span style="font-weight: bold; min-width: 20px; text-align: center;">${item.quantity}</span>
                            <button onclick="increaseQuantity(${index})" style="background: #2ed573; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">+</button>
                        </div>
                        <button onclick="removeFromCart(${index})" style="background: #ff4757; color: white; border: none; padding: 0.5rem; border-radius: 5px; cursor: pointer;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = cartHTML;
        cartTotal.style.display = 'block';
        document.getElementById('totalAmount').textContent = formatPrice(total);
    }
}

// Hàm tăng số lượng
function increaseQuantity(index) {
    if (index >= 0 && index < cart.length) {
        cart[index].quantity += 1;
        updateCartDisplay();
        updateCartCount();
        showNotification('Khá Bành múa quạt approve tăng số lượng! 🕺');
    } else {
        console.error('Invalid index:', index);
    }
}

// Hàm giảm số lượng
function decreaseQuantity(index) {
    if (index >= 0 && index < cart.length) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        updateCartDisplay();
        updateCartCount();
        showNotification('Khá Bành nói: Giảm đi thì bình tĩnh nha! 😅');
    } else {
        console.error('Invalid index:', index);
    }
}

// Hàm xóa sản phẩm khỏi giỏ hàng
function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        updateCartDisplay();
        updateCartCount();
        showNotification('Khá Bành xóa giùm bạn rồi! Bye sản phẩm! 🕺');
    } else {
        console.error('Invalid index:', index);
    }
}

// Hàm cập nhật số lượng trong icon giỏ hàng
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    } else {
        console.error('cartCount not found');
    }
}

// Hàm format giá tiền
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Hàm hiển thị form thanh toán
function showCheckout() {
    if (cart.length === 0) {
        showNotification('Khá Bành bảo: Giỏ trống thì mua đi chứ! 😅');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderNames = cart.map(item => `${item.name} (x${item.quantity})`).join(', ');
    
    document.getElementById('orderName').value = orderNames;
    document.getElementById('price').value = formatPrice(total);
    
    document.getElementById('checkoutModal').style.display = 'block';
}

// Hàm đóng form thanh toán
function closeCheckout() {
    document.getElementById('checkoutModal').style.display = 'none';
    document.getElementById('checkoutForm').reset();
}

// Hàm xử lý form thanh toán
document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = checkoutForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            
            const formData = new FormData(checkoutForm);
            const orderData = {
                fullName: formData.get('fullName'),
                phone: formData.get('phone'),
                orderName: formData.get('orderName'),
                price: formData.get('price'),
                email: formData.get('email') || 'Không cung cấp',
                note: formData.get('note') || 'Không có ghi chú'
            };
            
            if (!orderData.fullName || !orderData.phone || !orderData.orderName) {
                showNotification('Khá Bành bảo: Điền đủ thông tin đi bạn ơi! 😓', 'error');
                submitBtn.disabled = false;
                return;
            }
            
            const discordMessage = {
                embeds: [{
                    title: '🛒 Đơn Hàng Mới - Khá Bành Approve! 🕺',
                    color: 0x667eea,
                    fields: [
                        { name: '👤 Họ và Tên', value: orderData.fullName, inline: true },
                        { name: '📱 Số Điện Thoại', value: orderData.phone, inline: true },
                        { name: '📧 Email', value: orderData.email, inline: true },
                        { name: '📦 Tên Đơn Hàng', value: orderData.orderName, inline: false },
                        { name: '💰 Giá', value: orderData.price, inline: true },
                        { name: '📝 Ghi Chú', value: orderData.note, inline: false }
                    ],
                    timestamp: new Date().toISOString(),
                    footer: { text: 'Cửa Hàng Tài Liệu - Khá Bành Múa Quạt' }
                }]
            };
            
            try {
                const response = await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(discordMessage)
                });
                
                if (response.ok) {
                    showNotification('Khá Bành nói: Đặt hàng thành công! Liên hệ sớm nha! 🕺', 'success');
                    cart = [];
                    updateCartDisplay();
                    updateCartCount();
                    closeCheckout();
                    setTimeout(() => showTabProgrammatically('home'), 2000);
                } else {
                    throw new Error('Webhook failed');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('Khá Bành bảo: Lỗi rồi! Thử lại đi bạn ơi! 😓', 'error');
            } finally {
                submitBtn.disabled = false;
            }
        });
    } else {
        console.error('checkoutForm not found');
    }
});

// Hàm hiển thị thông báo
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; padding: 1rem 1.5rem;
        border-radius: 10px; color: white; font-weight: 600; z-index: 9999;
        animation: slideIn 0.3s ease; max-width: 300px; box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    `;
    
    const colors = {
        success: 'linear-gradient(135deg, #2ed573, #17c0eb)',
        error: 'linear-gradient(135deg, #ff4757, #ff3742)',
        info: 'linear-gradient(135deg, #667eea, #764ba2)'
    };
    notification.style.background = colors[type] || colors.info;
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Đóng modal khi click bên ngoài
window.onclick = function(event) {
    const modal = document.getElementById('checkoutModal');
    if (event.target === modal) closeCheckout();
}

// Hàm thêm GIF Khá Bành
function addKhaBanhGif() {
    const homeTab = document.getElementById('home');
    if (homeTab) {
        const gifContainer = document.createElement('div');
        gifContainer.className = 'khabanh-gif-container';
        gifContainer.style.cssText = 'text-align: center; margin: 20px 0; opacity: 0; transition: opacity 1s ease-in-out';
        gifContainer.innerHTML = `
            <a href="/images/khabanh.gif" target="_blank" class="gif-link">
                <img src="/images/khabanh.gif" alt="Khá Bành múa quạt" style="max-width: 300px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
            </a>
            <p style="color: #666; font-size: 0.9rem; margin-top: 10px;">Khá Bành approve tài liệu này! 🕺</p>
        `;
        homeTab.insertBefore(gifContainer, homeTab.firstChild);
        setTimeout(() => gifContainer.style.opacity = '1', 100);
    } else {
        console.error('home tab not found');
    }
}

// Khởi tạo
document.addEventListener('DOMContentLoaded', function() {
    showTabProgrammatically('home');
    updateCartCount();
    addKhaBanhGif();
});

// CSS cho hiệu ứng
const style = document.createElement('style');
style.textContent = `
    .gif-link { text-decoration: none; display: inline-block; }
    .gif-link:hover img { opacity: 0.8; transition: opacity 0.3s ease; }
    .gif-link:hover::after { content: " (Follow Link)"; color: #1e90ff; font-size: 0.8rem; margin-left: 5px; }
`;
<<<<<<< HEAD
document.head.appendChild(style);
=======
document.head.appendChild(style);
>>>>>>> 708e2a8c7f68236d4d325fd7f1f44b2d67c6f68d
