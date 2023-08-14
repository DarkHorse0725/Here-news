# Architecture (Table of contents)

- [Architecture (Table of contents)](#architecture-table-of-contents)
  - [Technologies](#technologies)
  - [Thinking in this architecture](#thinking-in-this-architecture)
  - [Layers of components](#layers-of-components)
  - [The Routing Layer](#the-routing-layer)
  - [The Layout Layer](#the-layout-layer)
  - [The Module Layer](#the-module-layer)
  - [The Block Layer](#the-block-layer)
  - [The Core Layer](#the-core-layer)

### Technologies

For foundation and rendering strategies

- NextJS

For styling

- [TailwindCSS](https://tailwindcss.com/)

- [React Icons](https://github.com/react-icons/react-icons)

For forms

- [React Hook Form](https://react-hook-form.com/)
- [Joi](https://github.com/hapijs/joi)

For persistent storage

- [JS Cookie](https://www.npmjs.com/package/js-cookie)

For HTTP

- [React Query](https://react-query-v3.tanstack.com/)
- [Axios](https://axios-http.com/docs/intro)

For global state

- {{TO BE DECIDED}}

Others

- Typescript (why not)

### Thinking in this architecture

We want to create abstractions around concepts that easily get out of hand or get difficult to maintain. The web is both wild and vibrant, backend architectural patterns make it rigid, less fun, and less easy to work with. Here we define our architecture and how to work with it (it's our own so we can modify it to our needs)

> We are trying to achieve a separation of concern for the app components based on their **usage**, **responsibility**, **interoperability**, and our **adopted tools** and
> **technologies**. The result should be an extendable solution maintaining these principles

This architecture proposes a layered approach and divides the commonly known parts into layers of concern. We know for a frontend app we would need routing, persistent storage, HTTP calls, a lot of UI, a cache system (in our case), and so on. There will always be exceptions, and when they come we will try to categorize them into one of the defined layers. If no category fulfills the new exception then it's time to make a new layer.

As with everything too much of it can be bad. Ex: we said we need abstractions, but over-abstraction can be bad a thing too. We need to follow a balanced path.

### Layers of components

Components are layered based on their usage, responsibility, interoperability, and our adopted tools and technologies.

1. The first layer is the **App** itself
2. An app can have many pages, each page represented by a **Route**
3. Each page on a route will have a **Layout** representation
4. Each **Layout** on a route will represent a feature of the **App**. This feature will be encapsulated by a **Module**
5. A **Module** is a collection of featured related UI **Blocks**. Ex: A post module (Module) may have a post card (Block).
6. Each **Block** is a collection of **Core** markup elements. A post card block will render some Media (like video, image which is Core markup), and it might have a comment Button (core).

```
|-- App
|   |-- Routing Layer
|   |   |-- Layout Layer
|   |   |   |-- Module Layer
|   |   |   |   |-- Block Layer
|   |   |   |   |   |-- Core Layer
```

Important: Each layer knows the layer below it but does not know the layer above it.

### The Routing Layer

We are using NextJS as the foundation of our app. This is done to control how we render the app for the user.

The routing layer should

- Handle Rendering strategies
- Map URL routes
- Compose each feature of the app in a layout for a specific URL - Glue Layout with an app feature
- (As needed) - Read or alter states in routes. Ex: `/post/:id` if we want to get `:id`, it should happen in this layer. Similarly, if we want to alter a route, it should be done via the routing layer. (Another approach could be to make our router abstraction and pass it as a prop to each module to handle to rest)
- (As needed) Read/Write to persistent storage only in the context of a rendering strategy.

It should not

- Handle (Read, Modify, or Store) any app state other than in the context of rendering or URLs or gluing the layout with feature modules
- Use a Block or Core component directly. If there is a case when we have to do that, then we have a new feature on our hands, and it's time to make a new module.
- Have its own layout (not exported from the layout layer). Even in the simplest of cases where we have to do this, we should opt for making a new Layout. The thinking here is to make sure concerns are not all over the place.
- Handle any client-side API calls

### The Layout Layer

A layout represents the app's structure and its structural limitation. Ex: When we see a top-down layout we immediately know it should not be able to scroll sideways. Similarly, when we see a split screen, we are trying to convey 2 different "contexts/point-of-views" or a connection b/w 2 "contexts/point-of-views".

The layout acts as a base container for the app. It

- Is the base structure of the app
- Handles its UI responsiveness
- Glues UI that is to be displayed with a specific layout (i.e a header is mostly present on all pages)

It should not

- Directly handle state in any way
- Directly use a module or a block component (tho it can use core components)
- Handle any API calls
- Read/Write to persistent storage
- Read/Write to the routing layer to change/modify the current URL or shift to a different URL

#### Exception

1- A **_Header_**, **_Footer_**, and a **_Sidebar_** if they show dynamic data (like user auth state) do not fall under layouts, but they will be treated as a layout. This is because these components define the core structure of the page.

#### Why do we need this layer?

It can be tempting to merge the layout layer in the layer above or below it, but as we discussed earlier, components are layered based on their usage, responsibility, interoperability, and our adopted tools and technologies.

### The Module Layer

The module is the feature layer of the app.

A module is a feature and each feature should be a module.

It

- Should handle the entire feature and its business logic
- Should handle any API calls related to the feature
- Should handle data cache via "react-query"
- (As needed) Read/Write to the routing layer to change/modify the current URL or shift to a different URL
- (As needed) Read/Write to persistent storage
- Should be composed of block or core components. It can have its ad-hoc UI as well, if that ad-hoc UI gets used in a lot of places then it should be converted into a block component

It should not

- Include any component from any layer above them. If some modules follow a specific structure then that structure should be converted into a Block component to be reusable.

### The Blocks Layer

By definition

> Block components are a meaningfully composed unit of UI with a defined role aware of where they are used.

By their nature they are

- **Dumb**: They should not hold an external state (similar to a presentation component). They are only allowed to have an external state (implied stated) if they are composed of other block components. They are smart components for their layer but presentation components for layers above them.
- **Composite**: They could be composed of core or other block components
- **Definitive**: They have a defined purpose and should be only used for such.
- **Stateful**: They can have an internal state (as needed) but this state should not be manageable from component layers above it.

By their context

- **Interplayable**: They can work in harmony with other core or block components and are aware of them.

By their usage

- **Placement aware**: They know where they will be used and also follow their definitive nature

They should not

- Include any component from any layer above them
- Handle any business logic
- Handle any API calls
- Do any type of third-party data cache
- Read/Write to the routing layer to change/modify the current URL or shift to a different URL
- Read/Write to persistent storage

### The Core Layer

> Core components extend the core logic of HTML or they are an absolute unit of the user interface

By their nature they are

- **Dumb**: They should not hold an external state (similar to a presentation component). They are only allowed to have an external state (implied stated) if they are composed of other core components. They are smart components for their layer but presentation components for layers above them.
- **Composite**: They could be composed of other core components
- **Absolute**: They are a single unit of UI or composed only of other core components. They can only have implied behavior when used with other core components but in a standalone mode, they are absolute.
- **Non-Definitive**: They are just a unit of UI, that UI may have a purpose but without context, they don't mean anything.
- **Stateful**: They can have an internal state (as needed) but this state should not be manageable from component layers above it.

They are an enhancement of what they are replacing

- **Functionality**: They enhance the functionality of the core HTML or the absolute unit of UI they provide. Example: A **_core Input_** should handle validation itself when used in **_core Forms_**. Also, it should provide configurable styles, sizes, and type variants all managed consistently internally and only relevant to the **_core Input_** itself.
- **Design**: A core component should handle its different dimensions based on screen sizes on its own by receiving the size it should initiate with. They also should handle any unique styling based on the config received. Example: `<Button size="small" variant="dark"></Button>` should start from a small size and be responsive across all sensible screen sizes

By their context

- **Interplayable**: They can work in harmony with other core components and are aware of them. For example, a **core Form** should work with available core form controls like **_core Input_**, but they are not aware of any layer above them.

By their usage

- **Placement unaware**: They don't know where or in which context or location they will be used in.

#### Example

A **_core Button_** should have extended functionality of the **_HTML button_**. That functionality can be different style variants, state indicators, responsive variants and anything that can be done with a **_HTML button_** in a redundant way should be handled by the **_core Button_**.

By this example, it might seem like some core components are invalid and their existence is somewhat of a block component or a hybrid b/w block and core. But **_one important thing about core components is that they are not only enhanced versions of HTML but an absolute unit of UI as well_**. An icon is an absolute unit of UI for example.

They should not

- Include any component from any layer above them
- Handle any business logic
- Handle any API calls
- Do any type of third-party data cache
- Read/Write to the routing layer to change/modify the current URL or shift to a different URL
- Read/Write to persistent storage
