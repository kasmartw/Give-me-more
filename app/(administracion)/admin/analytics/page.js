"use client"
import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';

const ProductTable = () => {
    const [products, setProducts] = useState([
        {
            id: '099873',
            name: 'NESTLÉ NIDO 1+ Mil...',
            price: 89.00,
            stock: 15,
            active: true,
            image: '🥛',
            selected: false
        },
        {
            id: '099872',
            name: 'The Meadows Who...',
            price: 89.00,
            stock: 98,
            active: true,
            image: '🥛',
            selected: false
        },
        {
            id: '099871',
            name: 'Nestle Milo',
            price: 49.00,
            stock: 15,
            active: true,
            image: '🍫',
            selected: false
        },
        {
            id: '099870',
            name: 'Similac Go & Grow...',
            price: 49.00,
            stock: 23,
            active: false,
            image: '🍼',
            selected: false
        }
    ]);

    const [openMenu, setOpenMenu] = useState(null);

    const toggleActive = (id) => {
        setProducts(products.map(p =>
            p.id === id ? { ...p, active: !p.active } : p
        ));
    };

    const toggleSelect = (id) => {
        setProducts(products.map(p =>
            p.id === id ? { ...p, selected: !p.selected } : p
        ));
    };

    const toggleMenu = (id) => {
        setOpenMenu(openMenu === id ? null : id);
    };

    return (
        <div className="w-full bg-gray-50 min-h-screen p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search for a product"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Product List */}
                <div className="space-y-3">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 relative hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 sm:gap-3">
                                {/* Checkbox */}
                                <div className="flex-shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={product.selected}
                                        onChange={() => toggleSelect(product.id)}
                                        className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                </div>

                                {/* Product Image */}
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded flex items-center justify-center text-xl sm:text-2xl">
                                    {product.image}
                                </div>

                                {/* Product Info */}
                                <div className="flex-grow min-w-0">
                                    <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base">{product.name}</h3>
                                    <p className="text-xs sm:text-sm text-gray-500">ID: {product.id}</p>
                                    <div className="flex items-center gap-2 sm:gap-4 mt-1">
                                        <span className="text-xs sm:text-sm text-gray-500">Stock Level: <span className="font-medium text-gray-900">{product.stock}</span></span>
                                    </div>
                                </div>

                                {/* Price and Status - Desktop */}
                                <div className="hidden md:flex flex-shrink-0 flex-col items-end gap-2">
                                    <p className="font-semibold text-gray-900 text-lg">${product.price.toFixed(2)}</p>
                                    <button
                                        onClick={() => toggleActive(product.id)}
                                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${product.active ? 'bg-green-500' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${product.active ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                    <p className={`text-xs font-medium ${product.active ? 'text-green-600' : 'text-gray-500'}`}>
                                        {product.active ? 'Active' : 'Inactive'}
                                    </p>
                                </div>

                                {/* Price and Status - Mobile */}
                                <div className="flex md:hidden flex-shrink-0 flex-col items-end gap-1">
                                    <p className="font-semibold text-gray-900 text-base">${product.price.toFixed(2)}</p>
                                    <button
                                        onClick={() => toggleActive(product.id)}
                                        className={`relative inline-flex items-center h-5 rounded-full w-9 transition-colors ${product.active ? 'bg-green-500' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block w-3 h-3 transform bg-white rounded-full transition-transform ${product.active ? 'translate-x-5' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>

                                {/* More Options Button */}
                                <div className="flex-shrink-0 relative">
                                    <button
                                        onClick={() => toggleMenu(product.id)}
                                        className="p-1 hover:bg-gray-100 rounded"
                                    >
                                        <MoreVertical className="w-5 h-5 text-gray-500" />
                                    </button>

                                    {/* Popup Menu */}
                                    {openMenu === product.id && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setOpenMenu(null)}
                                            />
                                            <div className="absolute right-0 top-8 z-20 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                                                <button className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors">
                                                    Editar producto
                                                </button>
                                                <button className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors">
                                                    Ver detalles
                                                </button>
                                                <button className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors">
                                                    Duplicar
                                                </button>
                                                <button className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-200">
                                                    Eliminar
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductTable;