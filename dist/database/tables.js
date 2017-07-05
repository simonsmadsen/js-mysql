'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const AccessKinds = exports.AccessKinds = {
  access_kind_id: 'id',
  title: 'string',
  created_at: 'datetime',
  updated_at: 'datetime',
  deleted: 'bool'
};

const Access = exports.Access = {
  access_id: 'id',
  access_kind_id: 'int',
  access_token: 'text',
  access_token2: 'text',
  access_token3: 'text',
  'owner_id': 'int',
  created_at: 'datetime',
  updated_at: 'datetime',
  deleted: 'bool'
};

// Owner er både bruger eller grupper.
const Owner = exports.Owner = {
  owner_id: 'id',
  title: 'text',
  created_at: 'datetime',
  updated_at: 'datetime',
  deleted: 'bool'
};

const OwnerPartnerships = exports.OwnerPartnerships = {
  owner_partnership_id: 'id',
  owner_partner_a: 'int',
  owner_partner_b: 'int',
  created_at: 'datetime',
  updated_at: 'datetime',
  deleted: 'bool'
};

const OwnerPartnershipTypes = exports.OwnerPartnershipTypes = {
  owner_partnership_type_id: 'id',
  title: 'string',
  created_at: 'datetime',
  updated_at: 'datetime',
  deleted: 'bool'
};

const OwnerTags = exports.OwnerTags = {
  owner_tag_id: 'id',
  owner_id: 'int',
  tag_id: 'int',
  created_at: 'datetime',
  updated_at: 'datetime',
  deleted: 'bool'
};

const Tags = exports.Tags = {
  tag_id: 'id',
  title: 'string',
  created_at: 'datetime',
  updated_at: 'datetime',
  deleted: 'bool'
};

const TagLinks = exports.TagLinks = {
  tag_link_id: 'id',
  link_id: 'int',
  tag_id: 'int',
  created_at: 'datetime',
  updated_at: 'datetime',
  deleted: 'bool'
};

const Links = exports.Links = {
  link_id: 'id',
  url: 'string',
  created_at: 'datetime',
  updated_at: 'datetime',
  deleted: 'bool'
};

const Headlines = exports.Headlines = {
  headline_id: 'id',
  title: 'string',
  created_at: 'datetime',
  updated_at: 'datetime',
  deleted: 'bool'
};

const HeadlineLinks = exports.HeadlineLinks = {
  headline_link_id: 'id',
  headline_id: 'int',
  link_id: 'int',
  created_at: 'datetime',
  updated_at: 'datetime',
  deleted: 'bool'
};

const OwerLinks = exports.OwerLinks = {
  owner_link_id: 'id',
  owner_id: 'int',
  link_id: 'int',
  created_at: 'datetime',
  updated_at: 'datetime',
  deleted: 'bool'
};