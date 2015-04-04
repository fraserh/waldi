class Item(object):
  def __init__(self, store, title, price_per_kle, kle, 
               unit_price, unit_volume, amount, category):
    self.store = store
    self.title = title
    self.price_per_kle = price_per_kle
    self.kle = kle
    self.unit_price = unit_price
    self.unit_volume = unit_volume
    self.amount = amount
    self.category = category
