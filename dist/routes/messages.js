"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messages_1 = require("../controller/messages");
const router = (0, express_1.Router)();
router.get('/', messages_1.getUsers);
router.get('/:id', messages_1.getUser);
router.post('/', messages_1.createUser);
router.put('/edit/:id', messages_1.updateUser);
router.delete('/:id', messages_1.deleteUser);
exports.default = router;
//# sourceMappingURL=messages.js.map