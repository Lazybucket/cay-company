// Biến toàn cục
let cart = [];
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1398341014439198771/EfzFXfVGoBuQlUu6OlYe2C0-Pn7PGHhTTVNfjiRoovrHUbClr5EJXen_5PUzaDxtlszo';
let currentProduct = 0;
const totalProducts = 3;

// Định nghĩa sản phẩm
const products = [
    {
        id: 1,
        name: 'Tài liệu học tập vào 10',
        price: 30000,
        quantity: 1
    },
    {
        id: 2,
        name: 'Combo học tập Toán - Văn - Anh',
        price: 129000,
        quantity: 1
    },
    {
        id: 3,
        name: 'Gói VIP - Tài liệu Premium',
        price: 299000,
        quantity: 1
    },
];

// Hàm chuyển đổi tab
function showTab(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    // Nếu chuyển đến tab products, đảm bảo hiển thị đúng sản phẩm
    if (tabName === 'products') {
        setTimeout(() => {
            showProduct(currentProduct);
        }, 100);
    }
}

// Hàm chuyển sản phẩm
function changeProduct(direction) {
    const newProduct = currentProduct + direction;
    
    if (newProduct >= 0 && newProduct < totalProducts) {
        currentProduct = newProduct;
        showProduct(currentProduct);
        updateCarouselButtons();
        updateIndicators();
    }
}

// Hàm hiển thị sản phẩm
function showProduct(index) {
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach((card, i) => {
        card.classList.remove('active', 'prev', 'next');
        
        if (i === index) {
            card.classList.add('active');
        } else if (i < index) {
            card.classList.add('prev');
        } else {
            card.classList.add('next');
        }
    });
}

// Hàm cập nhật nút carousel
function updateCarouselButtons() {
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    
    if (currentProduct === 0) {
        prevBtn.classList.add('hidden');
    } else {
        prevBtn.classList.remove('hidden');
    }
    
    if (currentProduct === totalProducts - 1) {
        nextBtn.classList.add('hidden');
    } else {
        nextBtn.classList.remove('hidden');
    }
}

// Hàm cập nhật indicators
function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        if (index === currentProduct) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Hàm chuyển đến sản phẩm cụ thể
function goToProduct(index) {
    currentProduct = index;
    showProduct(currentProduct);
    updateCarouselButtons();
    updateIndicators();
}

// Hàm thêm vào giỏ hàng
function addToCart(productIndex) {
    const product = products[productIndex];
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showNotification(`Đã thêm "${product.name}" vào giỏ hàng!`);
    
    // Hiệu ứng button
    const button = event.target;
    button.classList.add('loading');
    setTimeout(() => {
        button.classList.remove('loading');
    }, 1000);
}

// Hàm cập nhật hiển thị giỏ hàng
function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    const totalAmount = document.getElementById('totalAmount');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Giỏ hàng của bạn đang trống!</p>
                <p>Hãy thêm một số tài liệu học tập vào giỏ hàng nhé 📚</p>
                <button class="btn-primary" onclick="showTab('products')">
                    <i class="fas fa-shopping-bag"></i> Mua Sắm Ngay
                </button>
            </div>
        `;
        cartSummary.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">${item.price.toLocaleString()} VNĐ</p>
                </div>
                <div class="cart-item-controls">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        totalAmount.textContent = `${totalPrice.toLocaleString()} VNĐ`;
        cartSummary.style.display = 'block';
    }
}

// Hàm cập nhật số lượng
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
        }
    }
}

// Hàm xóa khỏi giỏ hàng
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    showNotification('Đã xóa sản phẩm khỏi giỏ hàng!');
}

// Hàm hiển thị form thanh toán
function showCheckoutForm() {
    if (cart.length === 0) {
        showNotification('Giỏ hàng trống!', 'error');
        return;
    }

    // Tạo modal form thanh toán
    const modal = document.createElement('div');
    modal.id = 'checkoutModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    const formContainer = document.createElement('div');
    formContainer.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 10px;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        position: relative;
    `;

    // Tính tổng tiền
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    formContainer.innerHTML = `
        <h2 style="text-align: center; color: #007bff; margin-bottom: 20px;">Thông tin thanh toán</h2>
        <form id="checkoutForm" style="display: flex; flex-direction: column; gap: 15px;">
            <div>
                <label style="display: block; margin-bottom: 5px;">Họ và Tên *</label>
                <input type="text" id="fullName" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <div>
                <label style="display: block; margin-bottom: 5px;">Số điện thoại *</label>
                <input type="tel" id="phone" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <div>
                <label style="display: block; margin-bottom: 5px;">Email</label>
                <input type="email" id="email" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <div>
                <label style="display: block; margin-bottom: 5px;">Tên đơn hàng *</label>
                <input type="text" id="orderName" required value="${cart[0].name}" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <div>
                <label style="display: block; margin-bottom: 5px;">Đơn giá *</label>
                <input type="number" id="orderPrice" required value="${totalPrice}" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <div>
                <label style="display: block; margin-bottom: 5px;">Ghi chú</label>
                <textarea id="notes" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; resize: vertical;"></textarea>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button type="submit" style="background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Xác nhận</button>
                <button type="button" onclick="closeCheckoutModal()" style="background: #dc3545; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Hủy</button>
            </div>
        </form>
    `;

    modal.appendChild(formContainer);
    document.body.appendChild(modal);

    // Xử lý submit form
    const checkoutForm = document.getElementById('checkoutForm');
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value || 'Không cung cấp';
        const orderName = document.getElementById('orderName').value;
        const orderPrice = document.getElementById('orderPrice').value;
        const notes = document.getElementById('notes').value || 'Không có ghi chú';

        const orderDetails = cart.map(item => 
            `• ${item.name} - SL: ${item.quantity} - Giá: ${(item.price * item.quantity).toLocaleString()} VNĐ`
        ).join('\n');

        const message = {
            embeds: [{
                title: "🛒 ĐƠN HÀNG MỚI",
                color: 0x00ff00,
                fields: [
                    { name: "👤 Họ và Tên", value: fullName, inline: true },
                    { name: "📱 Số điện thoại", value: phone, inline: true },
                    { name: "📧 Email", value: email, inline: true },
                    { name: "📦 Tên đơn hàng", value: orderName },
                    { name: "💰 Đơn giá", value: `${parseInt(orderPrice).toLocaleString()} VNĐ` },
                    { name: "📝 Chi tiết đơn hàng", value: orderDetails },
                    { name: "📌 Ghi chú", value: notes },
                    { name: "🕒 Thời gian", value: new Date().toLocaleString('vi-VN') }
                ],
                footer: { text: "Đơn hàng từ Cửa Hàng Tài Liệu Học Tập" }
            }]
        };

        fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message)
        })
        .then(response => {
            if (response.ok) {
                showModal('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
                cart = [];
                updateCartDisplay();
                closeCheckoutModal();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!', 'error');
        });
    });
}

// Hàm đóng modal thanh toán
function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.remove();
    }
}

// Hàm thanh toán (sửa để hiển thị form)
function checkout() {
    showCheckoutForm();
}

// Hàm hiển thị thông báo
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check' : 'fa-exclamation-triangle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Hàm hiển thị modal
function showModal(message) {
    const modal = document.getElementById('successModal');
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.textContent = message;
    modal.style.display = 'block';
}

// Hàm đóng modal
function closeModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
}

// Xử lý form liên hệ
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('customerName').value;
            const email = document.getElementById('customerEmail').value;
            const message = document.getElementById('customerMessage').value;
            
            const contactMessage = {
                content: `📧 **TIN NHẮN LIÊN HỆ** 📧
                
**Từ:** ${name}
**Email:** ${email}
**Tin nhắn:**
${message}

**Thời gian:** ${new Date().toLocaleString('vi-VN')}

---
*Tin nhắn từ form liên hệ*`
            };
            
            fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactMessage)
            })
            .then(response => {
                if (response.ok) {
                    showModal('Tin nhắn đã được gửi thành công! Chúng tôi sẽ phản hồi sớm nhất.');
                    contactForm.reset();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại!', 'error');
            });
        });
    }

    // Khởi tạo carousel
    updateCarouselButtons();
    updateIndicators();
    
    // Đóng modal khi click outside
    window.onclick = function(event) {
        const modal = document.getElementById('successModal');
        const checkoutModal = document.getElementById('checkoutModal');
        if (event.target === modal) {
            closeModal();
        }
        if (event.target === checkoutModal) {
            closeCheckoutModal();
        }
    }
    
    // Đóng modal khi click nút close
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.onclick = closeModal;
    }
});
