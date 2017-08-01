import { Router } from 'express'
import { registerClient } from './register_client'

export const APIClientRouter: Router = Router()

APIClientRouter.post('/', registerClient) // Register client

APIClientRouter.get('/') // Index client

APIClientRouter.get('/:clientId') // Get client by ID
